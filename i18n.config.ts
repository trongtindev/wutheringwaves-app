// en
import en from './locales/en.json';
import characterEn from './locales/characters.en.json';

// vi
import vi from './locales/vi.json';
import characterVi from './locales/characters.vi.json';

// ko
import ko from './locales/ko.json';

// ja
import ja from './locales/ja.json';

// th
import th from './locales/th.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: { ...en, ...characterEn },
    vi: { ...vi, ...characterVi },
    ko: { ...ko },
    ja: { ...ja },
    th: { ...th }
  },
  missingWarn: false,
  warnHtmlInMessage: false,
  warnHtmlMessage: false
}));
