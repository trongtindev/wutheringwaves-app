import { defineStore } from 'pinia';

export const useApp = defineStore('useApp', () => {
  // uses
  const runtimeConfig = useRuntimeConfig();

  // config
  const { APP_NAME, DISCORD_INVITE_LINK, APP_VERSION, APP_REPO } =
    runtimeConfig.public;

  // define
  const name = computed(() => APP_NAME);
  const title = ref();
  const discord = computed(() => DISCORD_INVITE_LINK);
  const version = computed(() => APP_VERSION);
  const githubRepo = computed(() => APP_REPO);

  // states
  const fluid = ref(true);

  // computed
  const inDev = computed(() => import.meta.dev);
  const inProd = computed(() => !import.meta.dev);

  // functions
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // exports
  return {
    name,
    title,
    version,
    discord,
    githubRepo,
    fluid,
    inDev,
    inProd,
    scrollTop
  };
});

