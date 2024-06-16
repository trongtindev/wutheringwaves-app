import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { en, vi } from 'vuetify/locale';
import { md3 } from 'vuetify/blueprints';
import 'vuetify/styles';
// import { VCalendar } from 'vuetify/labs/components';

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
        hideDetails: true
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
      VExpansionPanels: {
        variant: 'accordion'
      },
      VAlert: {
        variant: 'outlined'
      },
      VSwitch: {},
      VPagination: {
        totalVisible: 6
      }
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            // primary: '#0045AC',
            // 'on-primary': '#041e49',
            // secondary: '#F2F4F5',
            // 'on-secondary': '#F2F4F5',
            // background: '#0d2136',
            // 'on-background': '#B8C5C9'
            // surface: '#071a2b',
            // 'on-surface': '#F2F4F5',
            // warning: '#B78800',
            // 'on-warning': '#B78800'
            // success: '#00796b',
            // 'on-success': '#01A816',
            // error: '#e46962'
          }
        }
      }
    },
    blueprint: md3
    // components: { VCalendar }
  });

  nuxtApp.vueApp.use(vuetify);
});
