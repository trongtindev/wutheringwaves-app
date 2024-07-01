import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Messaging } from 'firebase/messaging';
import type { Analytics } from 'firebase/analytics';
import type { FirebasePerformance } from 'firebase/performance';

export default defineNuxtPlugin(async () => {
  // uses
  const { isCrawler } = useDevice();
  const runtimeConfig = useRuntimeConfig();
  const uAnalytics = useAnalytics();

  // define
  const {
    FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_APP_ID
  } = runtimeConfig.public;

  let app: FirebaseApp | undefined;
  let auth: Auth | undefined;
  let messaging: Messaging | undefined;
  let analytics: Analytics | undefined;
  let performance: FirebasePerformance | undefined;

  if (!isCrawler) {
    const { initializeApp } = await import('firebase/app');
    app = initializeApp({
      apiKey: FIREBASE_API_KEY,
      projectId: FIREBASE_PROJECT_ID,
      authDomain: FIREBASE_AUTH_DOMAIN,
      storageBucket: 'wuthering-357ea.appspot.com',
      messagingSenderId: '255778051713',
      appId: FIREBASE_APP_ID,
      measurementId: 'G-TJSX2XNTR9'
    });

    const { getAuth } = await import('firebase/auth');
    auth = getAuth(app);

    const { getMessaging } = await import('firebase/messaging');
    messaging = getMessaging(app);

    if (!uAnalytics.optOut) {
      if (useAnalytics().optOut) {
        console.warn('firebase', 'analytics', 'optOut', true);
      } else if (!import.meta.dev) {
        const { getAnalytics } = await import('firebase/analytics');
        analytics = getAnalytics(app);

        const { getPerformance } = await import('firebase/performance');
        performance = getPerformance(app);
      }
    }
  }

  // exports
  return {
    provide: {
      firebase: {
        app,
        auth,
        messaging,
        analytics,
        performance
      }
    }
  };
});
