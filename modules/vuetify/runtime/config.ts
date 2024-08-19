import { createVuetify } from 'vuetify';
import { VBtn } from 'vuetify/components';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
  VStepperVertical,
  VStepperVerticalActions,
  VStepperVerticalItem,
} from 'vuetify/labs/VStepperVertical';
import { en, fr, id, it, ja, ko, th, tr, uk, vi, zhHans } from 'vuetify/locale';

export const vuetifyConfig = createVuetify({
  ssr: true,
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { en, fr, id, it, ja, ko, th, tr, uk, vi, zhHans },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    global: {
      elevation: 0,
    },
    VRow: {
      dense: true,
    },
    VPagination: {
      totalVisible: 4,
    },
    VContainer: {
      class: 'pa-2',
    },
    VListSubheader: {
      class: 'font-weight-bold',
    },
    VChip: {
      density: 'compact',
      class: 'rounded-sm',
    },
    VBtn: {
      class: 'text-body-2',
    },
    VAlert: {
      density: 'compact',
      variant: 'tonal',
    },
    VTextField: {
      variant: 'solo-filled',
    },
    VSelect: {
      variant: 'solo-filled',
    },
    VAutocomplete: {
      variant: 'solo-filled',
    },
    VTextarea: {
      variant: 'solo-filled',
    },
    VCombobox: {
      variant: 'solo-filled',
    },
    VCard: {
      // class: 'border-thin'
    },
    VCardBtn: {
      class: 'text-body-2',
      variant: 'tonal',
    },
    VTable: {
      density: 'comfortable',
    },
  },
  aliases: {
    VCardBtn: VBtn,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          // primary: '#1867c0',
          // 'on-primary': '#FFFFFF',
          // secondary: '#5CBBF6',
          // 'on-secondary': '#FFFFFF',
          background: '#13171B',
          // 'on-background': '#ffffff',
          surface: '#20252B',
          'on-surface': '#B6C2CF',
          // warning: '#F5CD47',
          // 'on-warning': '#000000',
          // success: '#7EE2B8',
          // 'on-success': '#ffffff',
          // error: '#FD9891'
          // 'on-error': '#ffffff'
        },
      },
      light: {
        colors: {
          // primary: '#0b57d0',
          // secondary: '#5CBBF6',
          // background: '#f3f3f3',
          surface: '#f3f3f3',
        },
      },
    },
  },
  components: {
    VStepperVertical,
    VStepperVerticalItem,
    VStepperVerticalActions,
  },
});
