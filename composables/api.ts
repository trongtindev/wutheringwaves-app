import { defineStore } from 'pinia';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export const useApi = defineStore('useApi', () => {
  // uses
  const auth = useAuth();
  const runtimeConfig = useRuntimeConfig();

  // config
  const { API_URL, API_TIMEOUT } = runtimeConfig.public;

  const instance = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!import.meta.dev) axiosRetry(instance);

  instance.interceptors.request.use(async (config) => {
    if (import.meta.client && auth.isLoggedIn) {
      if (
        config.url &&
        (!config.url.startsWith('http') || config.url.startsWith(API_URL))
      ) {
        const accessToken = await auth.getAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  });

  // functions
  const getInstance = () => instance;

  // exports
  return { instance, getInstance };
});
