import en from './locales/en.json';
import vi from './locales/vi.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    vi
  },
  missingWarn: false
}));
