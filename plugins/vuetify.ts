import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { en, vi } from 'vuetify/locale';
import { md2 } from 'vuetify/blueprints';
import 'vuetify/styles';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: 'en',
      fallback: 'en',
      messages: { en, vi }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    defaults: {
      global: {
        density: 'comfortable',
        elevation: 0,
        hideDetails: true,
        ripple: false
      },
      VBtn: {
        density: 'default',
        variant: 'flat'
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
      VAutocomplete: {
        variant: 'outlined'
      },
      VSlider: {},
      VCard: {
        class: 'border rounded'
      },
      VCardText: {
        class: 'pa-2'
      },
      VRow: {
        dense: true
      },
      VTab: {
        style: 'text-transform: unset !important; color:rgb(144, 144, 144); '
      },
      VTooltip: {
        location: 'top'
      },
      VMenu: {
        transition: 'scale-transition'
      },
      VProgressCircular: {
        color: 'primary'
      },
      VExpansionPanel: {
        class: 'border rounded'
      },
      VExpansionPanels: {
        variant: 'accordion'
      },
      VAlert: {
        variant: 'outlined'
      },
      VSwitch: {},
      VPagination: {
        totalVisible: 4
      },
      VContainer: {
        class: 'pa-2'
      },
      VListSubheader: {
        class: 'font-italic font-weight-bold'
      }
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            // primary: '#1e88e5',
            // 'on-primary': '#ffffff',
            // secondary: '#03dac6',
            // 'on-secondary': '#000000',
            // background: '#121212',
            // 'on-background': '#ffffff',
            // surface: '#1e1e1e',
            // 'on-surface': '#ffffff',
            // warning: '#ff9800',
            // 'on-warning': '#000000',
            // success: '#4caf50',
            // 'on-success': '#ffffff',
            // error: '#f44336',
            // 'on-error': '#ffffff'
          }
        },
        light: {
          dark: false
        }
      }
    },
    blueprint: md2
  });

  nuxtApp.vueApp.use(vuetify);
});
