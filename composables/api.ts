import { defineStore } from 'pinia';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export const useApi = defineStore('useApi', () => {
  // uses
  const auth = useAuth();
  const route = useRoute();
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
        !config.url.startsWith('auth') &&
        (!config.url.startsWith('http') || config.url.startsWith(API_URL))
      ) {
        const forceRefreshToken =
          typeof route.query.forceRefreshToken != 'undefined';
        const accessToken = await auth.getAccessToken(forceRefreshToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  });

  instance.interceptors.response.use((response) => {
    if (response.status >= 200 && response.status <= 299) {
      response.data = parseDate(response.data);
    }
    return response;
  });

  // functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseDate = (data: any) => {
    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt);
    }

    if (data.updatedAt) {
      data.updatedAt = new Date(data.updatedAt);
    }

    if (data.items) {
      for (let i = 0; i < data.items.length; i += 1) {
        data.items[i] = parseDate(data.items[i]);
      }
    }

    return data;
  };

  const getInstance = () => instance;

  // exports
  return { instance, getInstance };
});
