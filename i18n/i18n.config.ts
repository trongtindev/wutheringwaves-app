// en
import en from './messages/en/default.json';

// id
import id from './messages/id/default.json';

// ja
import ja from './messages/ja/default.json';

// ko
import ko from './messages/ko/default.json';

// th
import th from './messages/th/default.json';

// tr
import tr from './messages/tr/default.json';

// uk
import uk from './messages/uk/default.json';

// vi
import vi from './messages/vi/default.json';

// uk
import zh from './messages/zh/default.json';

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
