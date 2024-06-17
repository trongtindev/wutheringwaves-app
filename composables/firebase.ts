import { defineStore } from 'pinia';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getMessaging, type Messaging, isSupported } from 'firebase/messaging';

export const useFirebase = defineStore('useFirebase', () => {
  // uses
  const { isDesktop, isAndroid } = useDevice();
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

    app.value = initializeApp(firebaseConfig);
    auth.value = getAuth(app.value);

    // Safari on iOS say no :)
    if ((isDesktop || isAndroid) && (await isSupported())) {
      messaging.value = getMessaging(app.value);
    }

    if (!import.meta.dev) {
      analytics.value = getAnalytics(app.value);
      performance.value = getPerformance(app.value);
    }
  };

  return { app, auth, analytics, performance, messaging, initialize };
});
