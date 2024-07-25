// en
import en from '../locales/en/default.json';

// id
import id from '../locales/id/default.json';

// ja
import ja from '../locales/ja/default.json';

// ko
import ko from '../locales/ko/default.json';

// th
import th from '../locales/th/default.json';

// tr
import tr from '../locales/tr/default.json';

// uk
import uk from '../locales/uk/default.json';

// vi
import vi from '../locales/vi/default.json';

// uk
import zh from '../locales/zh/default.json';

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
    uk: { ...uk },
    zh: { ...zh }
  },
  missingWarn: false,
  fallbackWarn: false,
  warnHtmlInMessage: false,
  warnHtmlMessage: false
}));
