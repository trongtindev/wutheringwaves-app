import { defineStore } from 'pinia';
import type { IUser } from '~/interfaces/user';
import { jwtDecode } from 'jwt-decode';

export const useAuth = defineStore('useAuth', () => {
  // uses
  const api = useApi();
  const sentry = useSentry();
  const runtimeConfig = useRuntimeConfig();

  // states
  const user = useCookie<IUser>('user');
  const state = ref<'' | 'sign-in'>('');
  const gState = useCookie('g_state');
  const device = useDevice();
  const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');
  const isScriptLoaded = ref(false);

  // functions
  const initialize = async () => {
    if (isSignedIn.value) {
      refreshProfile();
    }
    console.log('gState', gState.value);
  };

  const signIn = async (options?: { useFedCM?: boolean }) => {
    options ??= {};
    /**
     * Chrome third-party cookie deprecation starts Q1 2024.
     * https://developers.google.com/identity/gsi/web/guides/fedcm-migration
     */
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

    console.debug('google.accounts.id.initialize');
    const credential = await new Promise<string | null>((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: runtimeConfig.public.GOOGLE_CLIENT_ID,
        context: 'signin',
        callback: (result) => {
          console.debug('google.accounts.id.initialize', 'callback', result);
          resolve(result.credential);
        },
        auto_select: true,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: options.useFedCM
      });
      window.google.accounts.id.prompt(async (result) => {
        console.debug('google.accounts.id.prompt', result);
        if (result.isNotDisplayed()) {
          reject('isNotDisplayed');
        } else if (result.isSkippedMoment()) {
          resolve(null);
        }
      });
    });
    console.debug('google.accounts.id.initialize', credential);
    if (!credential) return;

    const signInResult = await api.getInstance().post<{
      accessToken: string;
      refreshToken: string;
    }>('auth/signin', {
      credential
    });
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
      const result = await api
        .getInstance()
        .post<{ accessToken: string }>('auth/refresh', {
          refreshToken: refreshToken.value
        });
      accessToken.value = result.data.accessToken;
    }

    return accessToken.value;
  };

  const refreshProfile = async () => {
    try {
      console.debug('refreshProfile');
      const result = await api.getInstance().get<IUser>('users/me');
      user.value = result.data;
      console.debug('refreshProfile', user.value);
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
    return user.value != null;
  });

  // changes
  watch(
    () => user.value,
    () => {
      if (user.value) {
        sentry.setUser({
          id: user.value.id,
          email: user.value.email
        });
      } else {
        sentry.setUser(null);
      }
    }
  );

  // lifecycle
  onMounted(() => initialize());

  return {
    state,
    user,
    isLoggedIn,
    isSignedIn,
    signIn,
    signOut,
    getAccessToken
  };
});
