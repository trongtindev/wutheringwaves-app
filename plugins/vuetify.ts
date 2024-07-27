import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { en, ja, ko, th, vi } from 'vuetify/locale';
import { md3 } from 'vuetify/blueprints';
import {
  VStepperVertical,
  VStepperVerticalItem,
  VStepperVerticalActions
} from 'vuetify/labs/VStepperVertical';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: 'en',
      fallback: 'en',
      messages: { en, ja, ko, th, vi }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    defaults: {
      global: {
        elevation: 0
      },
      VRow: {
        dense: true
      },
      VPagination: {
        totalVisible: 4
      },
      VContainer: {
        class: 'pa-2'
      },
      VListSubheader: {
        class: 'font-weight-bold'
      },
      VChip: {
        density: 'compact'
      },
      VBtn: {
        class: 'text-body-2'
      },
      VAlert: {
        density: 'compact',
        variant: 'tonal'
      },
      VTextField: {
        variant: 'solo-filled'
      },
      VSelect: {
        variant: 'solo-filled'
      },
      VTextarea: {
        variant: 'solo-filled'
      },
      VCombobox: {
        variant: 'solo-filled'
      },
      VCard: {
        class: 'border-thin'
      }
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#1867c0',
            // 'on-primary': '#FFFFFF',
            secondary: '#5CBBF6',
            // 'on-secondary': '#FFFFFF',
            background: '#1D2125',
            // 'on-background': '#ffffff',
            surface: '#22272b',
            'on-surface': '#B6C2CF',
            warning: '#F5CD47',
            // 'on-warning': '#000000',
            success: '#7EE2B8',
            // 'on-success': '#ffffff',
            error: '#FD9891'
            // 'on-error': '#ffffff'
          }
        },
        light: {
          colors: {
            primary: '#1867c0',
            secondary: '#5CBBF6'
          }
        }
      }
    },
    blueprint: md3,
    components: {
      VStepperVertical,
      VStepperVerticalItem,
      VStepperVerticalActions
    }
  });

  nuxtApp.vueApp.use(vuetify);
});
