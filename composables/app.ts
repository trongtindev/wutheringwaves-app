import { defineStore } from 'pinia';

export const useApp = defineStore('useApp', () => {
  // uses
  const runtimeConfig = useRuntimeConfig();

  // config
  const { APP_NAME, APP_DISCORD, APP_VERSION, APP_REPO } = runtimeConfig.public;

  const name = computed(() => APP_NAME);
  const discord = computed(() => APP_DISCORD);
  const version = computed(() => APP_VERSION);
  const githubRepo = computed(() => APP_REPO);

  const inDev = computed(() => import.meta.dev);
  const indProd = computed(() => !import.meta.dev);
  const indBeta = computed(() => false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    name,
    version,
    discord,
    githubRepo,
    inDev,
    indProd,
    indBeta,
    scrollTop
  };
});
