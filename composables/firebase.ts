import { defineStore } from 'pinia';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';
import type { FirebasePerformance } from 'firebase/performance';
import type { Messaging } from 'firebase/messaging';

export const useFirebase = defineStore('useFirebase', () => {
  // uses
  const { isDesktop, isAndroid, isCrawler } = useDevice();
  const runtimeConfig = useRuntimeConfig();

  // states
  const app = ref<FirebaseApp>();
  const auth = ref<Auth>();
  const analytics = ref<Analytics>();
  const performance = ref<FirebasePerformance>();
  const messaging = ref<Messaging>();

  const initialize = async () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize firebase on server-side!');
    }

    // define
    const { FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_AUTH_DOMAIN } =
      runtimeConfig.public;

    const firebaseConfig = {
      apiKey: FIREBASE_API_KEY,
      projectId: FIREBASE_PROJECT_ID,
      authDomain: FIREBASE_AUTH_DOMAIN,
      storageBucket: 'wuthering-357ea.appspot.com',
      messagingSenderId: '255778051713',
      appId: '1:255778051713:web:55a2e91470e8e1100b9f80',
      measurementId: 'G-TJSX2XNTR9'
    };

    const { initializeApp } = await import('firebase/app');
    app.value = initializeApp(firebaseConfig);

    const { getAuth } = await import('firebase/auth');
    auth.value = getAuth(app.value);

    // Safari on iOS say no :)
    const { getMessaging, isSupported } = await import('firebase/messaging');
    if ((isDesktop || isAndroid) && (await isSupported())) {
      messaging.value = getMessaging(app.value);
    }

    // ignore dev and crawler bot
    if (!import.meta.dev && !isCrawler) {
      if (useAnalytics().optOut) {
        console.warn('firebase', 'analytics', 'optOut', true);
      } else {
        const { getAnalytics } = await import('firebase/analytics');
        analytics.value = getAnalytics(app.value);
      }

      const { getPerformance } = await import('firebase/performance');
      performance.value = getPerformance(app.value);
    }
  };

  return { app, auth, analytics, performance, messaging, initialize };
});
