import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Messaging } from 'firebase/messaging';

/**
 * @deprecated
 */
export default defineNuxtPlugin(async () => {
  console.log('firebasePlugin');

  // uses
  const { isCrawler } = useDevice();
  const runtimeConfig = useRuntimeConfig();

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

    const { getMessaging, isSupported } = await import('firebase/messaging');
    if (await isSupported()) {
      messaging = getMessaging(app);
    }
  } else {
    console.log('firebasePlugin', 'ignore');
  }

  // exports
  return {
    provide: {
      firebase: {
        app,
        auth,
        messaging
      }
    }
  };
});
