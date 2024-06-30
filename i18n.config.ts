import en from './locales/en.json';
import characterEn from './locales/characters.en.json';

import vi from './locales/vi.json';
import characterVi from './locales/characters.vi.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: { ...en, ...characterEn },
    vi: { ...vi, ...characterVi }
  },
  missingWarn: false,
  warnHtmlInMessage: false,
  warnHtmlMessage: false
}));
