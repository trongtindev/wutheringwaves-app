// en
import en from './locales/en.json';

// id
import id from './locales/id.json';

// ja
import ja from './locales/ja.json';

// ko
import ko from './locales/ko.json';

// th
import th from './locales/th.json';

// tr
import tr from './locales/tr.json';

// vi
import vi from './locales/vi.json';

// uk
import uk from './locales/uk.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { ...en },
    id: { ...id },
    ja: { ...ja },
    ko: { ...ko },
    th: { ...th },
    tr: { ...tr },
    vi: { ...vi },
    uk: { ...uk }
  },
  missingWarn: false,
  warnHtmlInMessage: false,
  warnHtmlMessage: false
}));
