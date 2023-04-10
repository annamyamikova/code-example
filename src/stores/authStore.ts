import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

// API
import {
  getProfile,
  login,
  LoginResponse,
  logout,
  refresh,
  TokenData,
} from 'api/auth';

// Helpers
import instance from 'api/helpers/axios';

class AuthStore {
  @observable
  isLogin: boolean = false;

  @observable
  isChecking: boolean = true;

  @observable
  isChecked: boolean = false;

  refreshPromise: Promise<AxiosResponse<LoginResponse>> | null = null;

  @observable
  uuid: string | null = null;

  @observable
  accessToken: string | null = localStorage.getItem('accessToken') || null;

  @observable
  refreshToken: string | null = localStorage.getItem('refreshToken') || null;

  @observable
  expiresIn: Dayjs | null = localStorage.getItem('expiresIn')
    ? dayjs(Number(localStorage.getItem('expiresIn')))
    : null;

  constructor() {
    makeObservable(this);

    this.uuid = localStorage.getItem('uuid');

    if (!this.uuid) {
      this.uuid = uuidv4();
      localStorage.setItem('uuid', this.uuid);
    }
  }

  @action
  setToken = (token: TokenData | null) => {
    this.accessToken = token?.accessToken || null;
    this.refreshToken = token?.refreshToken || null;
    this.expiresIn = token?.expiresIn ? dayjs(token?.expiresIn) : null;

    if (this.accessToken && this.refreshToken && this.expiresIn) {
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      localStorage.setItem('expiresIn', this.expiresIn.toISOString());
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
    }
  };

  login = async (email: string, password: string) => {
    try {
      const {
        data: { data },
      } = await login(email, password, this.uuid as string);

      this.setToken(data.token);

      runInAction(() => {
        this.isLogin = true;
      });
    } catch (error) {
      console.error(error);

      runInAction(() => {
        this.isLogin = false;
      });
    }
  };

  @action
  checkAuth = async () => {
    if (!this.accessToken || this.expiresIn?.isAfter(new Date())) {
      this.isChecked = true;
      this.isChecking = false;
      this.isLogin = false;

      if (this.accessToken) {
        this.setToken(null);
      }

      return;
    }

    this.isChecked = false;
    this.isChecking = true;

    try {
      await getProfile();

      runInAction(() => {
        this.isLogin = true;
      });
    } catch (error) {
      console.warn('checkAuth error', error);

      runInAction(() => {
        this.isLogin = false;
      });
    } finally {
      runInAction(() => {
        this.isChecked = true;
        this.isChecking = false;
      });
    }
  };

  logout = async () => {
    try {
      await logout();

      this.isLogin = false;
    } catch (error) {
      console.warn(error);
    } finally {
      this.setToken(null);
    }
  };
}

const authStore = new AuthStore();

instance.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers.Authorization = `Bearer ${authStore.accessToken || ''}`;

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error: {
    message?: string;
    config: AxiosRequestConfig;
    response?: AxiosResponse;
    statusCode: number;
  }) => {
    console.log('RESPONSE ERROR', error.message, Object.entries(error));

    const isInIgnoredUrlList = [
      '/auth/login',
      '/auth/refresh-token',
      '/auth/logout',
    ].includes(error.config?.url || '');

    if (!error.response && !isInIgnoredUrlList) {
      // eslint-disable-next-line no-alert
      alert(
        'No internet connection.\nPlease, check your internet and try again'
      );

      return Promise.reject(error);
    }

    if (
      authStore.refreshToken &&
      authStore.uuid &&
      !isInIgnoredUrlList &&
      (error.response?.status === 401 ||
        error.message === 'Error: Request failed with status code 401' ||
        ((error.response?.status === 403 ||
          error.message === 'Error: Request failed with status code 403') &&
          error.response?.data === 'User is not authenticated'))
    ) {
      if (!authStore.refreshPromise) {
        authStore.refreshPromise = refresh(
          authStore.refreshToken,
          authStore.uuid
        );
      }

      const result = await authStore.refreshPromise;

      authStore.refreshPromise = null;

      if (!result) {
        return Promise.reject();
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      error.config.headers!.Authorization = `Bearer ${
        authStore.accessToken || ''
      }`;
      error.config.baseURL = undefined;

      return axios.request(error.config);
    }

    // if (error.response.status === 400 || error.message === 'Error: Request failed with status code 400') {
    //   Toast.show('Fields are filled in incorrectly.\nPlease, set correctly values', {
    //     duration: 1500,
    //   });
    // }

    console.warn('HTTP Error', error);

    if (
      !isInIgnoredUrlList &&
      error.response?.status &&
      error.response?.status >= 400 &&
      error.response?.status !== 401 &&
      error.response?.data !== 'User is not authenticated'
    ) {
      // eslint-disable-next-line no-alert
      alert(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data?.error?.message ||
          'Server error.\nPlease, try again later'
      );
    }

    if (error.response?.status) {
      error.statusCode = error.response.status;
    }

    return Promise.reject(error);
  }
);

export default authStore;
