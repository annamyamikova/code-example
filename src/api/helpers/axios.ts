import axios, { CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';

export interface PreInitAxiosPromiseWithCancelToken<T> extends Promise<T> {
  cancel?: () => void;
}

export interface AxiosPromiseWithCancelToken<T> extends Promise<T> {
  cancel: () => void;
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

    if (axios.isCancel(error)) {
      return new Promise(() => {});
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.response?.status === 401 || error?.response?.status === 400) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,no-alert
      toast.error(error?.response?.data?.error?.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.response?.status === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      toast.error(error?.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    return Promise.reject(error);
  }
);

export const generateCancelTokenSource = (): CancelTokenSource =>
  axios.CancelToken.source();

export default instance;
