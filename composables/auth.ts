import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { setUser } from '@sentry/vue';

export const useAuth = defineStore('useAuth', () => {
  // uses
  const route = useRoute();
  const nuxtApp = useNuxtApp();

  // states
  const user = ref<User>(null as any);
  const state = ref<'' | 'sign-in'>('');

  // functions
  const signIn = async (options?: { signInWithRedirect?: boolean }) => {
    options ??= {};

    const {
      signInWithPopup,
      signInWithRedirect,
      signInAnonymously,
      GoogleAuthProvider
    } = await import('firebase/auth');

    return new Promise((resolve, reject) => {
      if (!nuxtApp.$firebase.auth) {
        throw new Error('firebase_not_initialized');
      }

      if (import.meta.dev) {
        // https://github.com/firebase/firebase-js-sdk/issues/7342
        signInAnonymously(nuxtApp.$firebase.auth).then(resolve).catch(reject);
        return;
      }

      const provider = new GoogleAuthProvider();
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        navigator.cookieEnabled === false ||
        route.query.signInWithRedirect ||
        options.signInWithRedirect
      ) {
        localStorage.setItem('signInWithRedirect', 'true');
        signInWithRedirect(nuxtApp.$firebase.auth, provider)
          .then(resolve)
          .catch(reject);
      } else {
        signInWithPopup(nuxtApp.$firebase.auth, provider)
          .then(resolve)
          .catch(reject);
      }
    });
  };

  const signOut = async () => {
    const { signOut: firebaseSignOut } = await import('firebase/auth');

    return new Promise((resolve, reject) => {
      firebaseSignOut(nuxtApp.$firebase.auth!).then(resolve).catch(reject);
    });
  };

  const getAccessToken = async () => {
    return await nuxtApp.$firebase.auth!.currentUser?.getIdToken();
  };

  // computed
  const isLoggedIn = computed(() => {
    return user.value != null;
  });

  // lifecycle
  const initialize = async () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize auth on server-side!');
    }

    if (!nuxtApp.$firebase.auth) {
      console.log('reinit');
      setTimeout(() => initialize(), 250);
      return;
    }

    nuxtApp.$firebase.auth.onAuthStateChanged((e) => {
      user.value = e as any;

      if (user.value) {
        setUser({
          id: user.value.uid,
          email: user.value.email || undefined
        });
      } else {
        setUser(null);
      }
    });

    if (localStorage.getItem('signInWithRedirect')) {
      localStorage.removeItem('signInWithRedirect');

      state.value = 'sign-in';
      const { getRedirectResult } = await import('firebase/auth');

      getRedirectResult(nuxtApp.$firebase.auth)
        .then(() => {})
        .catch(console.warn)
        .finally(() => {
          state.value = '';
        });
    }
  };

  return {
    state,
    user,
    isLoggedIn,
    signIn,
    signOut,
    getAccessToken,
    initialize
  };
});
