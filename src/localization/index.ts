import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Locales
import { locales } from './locales';

const DEFAULT_LANG: string =
  localStorage.getItem('LOCALE') || Object.keys(locales)[0] || 'ruRU';

i18n.use(initReactI18next).init({
  resources: locales,
  lng: DEFAULT_LANG,

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (locale: string): void => {
  i18n.changeLanguage(locale);
  localStorage.setItem('LOCALE', locale);
};

export default i18n;
