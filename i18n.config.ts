import en from './locales/en.json';
import vi from './locales/vi.json';

export const locales = [
  { title: 'English', code: 'en', iso: 'en-US' },
  { title: 'Vietnamese', code: 'vi', iso: 'vi-VN' }
];

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    vi
  },
  missingWarn: false
}));
