import { defineStore } from 'pinia';
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  type User,
  signOut as firebaseSignOut
} from 'firebase/auth';
import * as Sentry from '@sentry/vue';

export const useAuth = defineStore('useAuth', () => {
  // uses
  const route = useRoute();
  const firebase = useFirebase();

  // states
  const user = ref<User>(null as any);
  const state = ref<'' | 'sign-in'>('');

  // functions
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    /**
     * Best practices for using signInWithRedirect on browsers that block third-party storage access
     */
    return new Promise((resolve, reject) => {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        navigator.cookieEnabled === false ||
        route.query.signInWithRedirect
      ) {
        localStorage.setItem('signInWithRedirect', 'true');
        signInWithRedirect(firebase.auth!, provider)
          .then(resolve)
          .catch(reject);
      } else {
        signInWithPopup(firebase.auth!, provider).then(resolve).catch(reject);
      }
    });
  };

  const signOut = async () => {
    return new Promise((resolve, reject) => {
      firebaseSignOut(firebase.auth!).then(resolve).catch(reject);
    });
  };

  const getAccessToken = async () => {
    return await firebase.auth!.currentUser?.getIdToken();
  };

  // computed
  const isLoggedIn = computed(() => {
    return user.value != null;
  });

  // lifecycle
  const initialize = () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize auth on server-side!');
    }

    if (!firebase.app || !firebase.auth) {
      setTimeout(() => initialize(), 250);
      return;
    }

    firebase.auth.onAuthStateChanged((e) => {
      user.value = e as any;

      if (user.value) {
        Sentry.setUser({
          id: user.value.uid,
          email: user.value.email || undefined
        });
      } else {
        Sentry.setUser(null);
      }
    });

    if (localStorage.getItem('signInWithRedirect')) {
      localStorage.removeItem('signInWithRedirect');

      state.value = 'sign-in';
      getRedirectResult(firebase.auth!)
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
