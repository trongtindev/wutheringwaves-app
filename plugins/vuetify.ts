import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { en, ja, ko, th, vi } from 'vuetify/locale';
import { md2 } from 'vuetify/blueprints';
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
        density: 'comfortable'
      },
      VAppBar: {
        density: 'default'
      },
      VSelect: {
        variant: 'outlined',
        itemValue: 'value',
        itemTitle: 'title'
      },
      VTextarea: {
        variant: 'outlined'
      },
      VTextField: {
        variant: 'outlined'
      },
      VCombobox: {
        variant: 'outlined'
      },
      VRow: {
        dense: true
      },
      // VMenu: {
      //   transition: 'scale-transition'
      // },
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
        class: 'text-body-2',
        density: 'default'
      },
      VAlert: {
        density: 'compact'
      }
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#579DFF',
            // 'on-primary': '#FFFFFF',
            // secondary: '#625B71',
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
          dark: false,
          colors: {
            primary: '#579DFF'
          }
        }
      }
    },
    blueprint: md2,
    components: {
      VStepperVertical,
      VStepperVerticalItem,
      VStepperVerticalActions
    }
  });

  nuxtApp.vueApp.use(vuetify);
});
