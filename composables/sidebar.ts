import {
  mdiHomeOutline,
  mdiChartBarStacked,
  mdiCounter,
  mdiAccountGroup,
  mdiTrophy,
  mdiListStatus,
  mdiChartTimeline,
  mdiWalletGiftcard,
  mdiMap,
  mdiCalendar,
  mdiGrid,
  mdiCompareHorizontal,
  mdiBagPersonal,
  mdiCalculatorVariant,
} from '@mdi/js';

export interface IMenu {
  url?: string;
  icon?: string;
  title: string;
  items?: IMenu[];
  beta?: boolean;
  upcoming?: boolean;
  rel?: 'nofollow';
}

export const useSidebar = defineStore('useSidebar', () => {
  // uses
  const analytics = useAnalytics();
  const overlay = ref(false);

  // states
  const notify = ref<{
    [key: string]: {
      value: number;
      policy?: 'default' | 'resetOnVisit';
    };
  }>({});
  const open = ref();
  const items = ref<IMenu[]>([
    {
      url: '/',
      icon: mdiHomeOutline,
      title: 'sidebar.home',
    },
    {
      icon: mdiCounter,
      title: 'sidebar.convene',
      items: [
        {
          url: '/convene-history',
          title: 'sidebar.conveneHistory',
        },
        {
          url: '/convene-history/import',
          title: 'sidebar.conveneImport',
          rel: 'nofollow',
        },
        {
          url: '/convene-history/share',
          title: 'sidebar.conveneShare',
          upcoming: true,
        },
        {
          url: '/convene-history/global',
          title: 'sidebar.conveneGlobalStats',
        },
      ],
    },
    {
      url: '/timeline',
      icon: mdiCalendar,
      title: 'sidebar.timeline',
    },
    {
      url: '/map',
      icon: mdiMap,
      title: 'sidebar.map',
    },
    {
      url: '/characters',
      icon: '/icons/character.png',
      title: 'sidebar.characters',
    },
    {
      url: '/codes',
      icon: mdiWalletGiftcard,
      title: 'sidebar.codes',
    },
    {
      url: '/calculator',
      icon: mdiCalculatorVariant,
      title: 'sidebar.calculator',
      upcoming: true,
    },
    {
      url: '/teams',
      icon: mdiAccountGroup,
      title: 'sidebar.teams',
      upcoming: true,
    },
    {
      url: '/leaderboards',
      icon: mdiChartTimeline,
      title: 'sidebar.leaderboards',
      upcoming: true,
    },
    {
      url: '/tier-list',
      icon: mdiChartBarStacked,
      title: 'sidebar.tierList',
      upcoming: true,
    },
    {
      url: '/todo-list',
      icon: mdiListStatus,
      title: 'sidebar.todoList',
      upcoming: true,
    },
    {
      url: '/guides',
      icon: mdiMap,
      title: 'sidebar.guides',
    },
    // {
    //   url: '/comparison',
    //   icon: mdiCompareHorizontal,
    //   title: 'sidebar.comparison',
    //   upcoming: true,
    // },
    {
      icon: mdiBagPersonal,
      title: 'sidebar.database',
      items: [
        {
          url: '/items',
          icon: mdiGrid,
          title: 'sidebar.items',
        },
        {
          url: '/trophies',
          icon: mdiTrophy,
          title: 'sidebar.trophies',
        },
        {
          url: '/echoes',
          icon: '/icons/echo.png',
          title: 'sidebar.echoes',
        },
        {
          url: '/weapons',
          icon: '/icons/weapon.png',
          title: 'sidebar.weapons',
        },
      ],
    },
  ]);

  // functions
  const togglePin = (url: string) => {};

  const setNotify = (
    url: string,
    value: number,
    policy?: 'default' | 'resetOnVisit',
  ) => {
    notify.value[url] = { value, policy };
  };

  // events
  const onOpened = (
    url: string,
    options?: {
      ignoreAnalytics?: boolean;
    },
  ) => {
    options ??= {};
    if (!options.ignoreAnalytics) {
      analytics.logEvent('sidebar', { url });
    }

    Object.keys(notify.value).forEach((e) => {
      if (notify.value[e].policy === 'resetOnVisit') {
        delete notify.value[e];
      }
    });

    // TODO: update count to sort
  };

  // exports
  return { open, items, notify, togglePin, setNotify, onOpened, overlay };
});
