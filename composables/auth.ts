import { defineStore } from 'pinia';
import type { IUser } from '~/interfaces/user';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';

export const useAuth = defineStore('useAuth', () => {
  // uses
  const api = useApi();
  const route = useRoute();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig();

  // states
  const user = ref<IUser | null>(null);
  const state = ref<'' | 'sign-in'>('');
  const gState = useCookie('g_state');
  const device = useDevice();
  const accessToken = useLocalStorage<string | null>('accessToken', null);
  const refreshToken = useLocalStorage<string | null>('refreshToken', null);
  const isScriptLoaded = ref(false);

  // functions
  const initialize = async () => {
    if (route.query.code) {
      state.value = 'sign-in';
      signIn({ code: route.query.code.toString() })
        .catch((error) => {
          console.error(error);

          // TODO: handle
          if (error instanceof AxiosError) {
            alert(error.response ? JSON.stringify(error.response.data) : error);
          } else {
            alert(error);
          }
        })
        .finally(() => {
          state.value = '';
        });
      return;
    }

    if (isLoggedIn.value) {
      refreshProfile();
      return;
    }
  };

  const signIn = async (options?: { useFedCM?: boolean; code?: string }) => {
    options ??= {};
    // TODO: Chrome third-party cookie deprecation starts Q1 2024.
    // https://developers.google.com/identity/gsi/web/guides/fedcm-migration
    options.useFedCM ??= device.isMobile;

    gState.value = null;
    if (!isScriptLoaded.value) {
      const element = document.createElement('script');
      element.src = 'https://accounts.google.com/gsi/client';
      document.body.appendChild(element);

      while (typeof window.google === 'undefined') {
        await new Promise((resolve) => {
          setTimeout(resolve, 25);
        });
      }
      isScriptLoaded.value = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      code: options.code || undefined,
      idToken: undefined,
    };
    if (!options.code) {
      console.debug('google.accounts.id.initialize');
      const credential = await new Promise((resolve) => {
        window.google.accounts.id.initialize({
          client_id: runtimeConfig.public.GOOGLE_CLIENT_ID,
          context: 'signin',
          callback: (result) => {
            console.debug('google.accounts.id.initialize', 'callback', result);
            resolve(result.credential);
          },
          auto_select: true,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: options.useFedCM,
        });
        window.google.accounts.id.prompt(async (result) => {
          console.debug('google.accounts.id.prompt', result);
          if (result.isNotDisplayed()) {
            resolve('redirect');
          } else if (result.isSkippedMoment()) {
            resolve(null);
          }
        });
      });
      console.debug('google.accounts.id.initialize', credential);
      if (!credential) return;
      if (credential === 'redirect') {
        window.location.href = `${runtimeConfig.public.API_URL}/auth/redirect`;
        return;
      }
      payload.idToken = credential;
    } else {
      router.replace({
        path: route.path,
      });
    }

    const signInResult = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>('auth/signin', payload);
    accessToken.value = signInResult.data.accessToken;
    refreshToken.value = signInResult.data.refreshToken;

    await refreshProfile();
  };

  const signOut = async () => {
    accessToken.value = null;
    refreshToken.value = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.value = null as any;
  };

  const getAccessToken = async (forceRefresh?: boolean) => {
    if (!accessToken.value) {
      console.warn('accessToken == null');
      return null;
    }

    const isExpired = (() => {
      const decoded = jwtDecode(accessToken.value);
      if (!decoded.exp || decoded.exp < new Date().getTime()) {
        return false;
      }
      return true;
    })();

    if (isExpired || forceRefresh) {
      console.debug('getAccessToken()', 'refresh');
      const result = await api.post<{ accessToken: string }>('auth/refresh', {
        refreshToken: refreshToken.value,
      });
      accessToken.value = result.data.accessToken;
    }

    return accessToken.value;
  };

  const refreshProfile = async () => {
    try {
      const result = await api.get<IUser>('users/me');
      user.value = result.data;
    } catch (error) {
      console.warn(error);
      signOut();
    }
  };

  // computed
  const isLoggedIn = computed(() => {
    return refreshToken.value != null;
  });

  const isSignedIn = computed(() => {
    return isLoggedIn.value && user.value != null;
  });

  // lifecycle
  onMounted(() => initialize());

  return {
    state,
    user,
    isLoggedIn,
    isSignedIn,
    signIn,
    signOut,
    getAccessToken,
  };
});
