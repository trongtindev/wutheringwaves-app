import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Messaging } from 'firebase/messaging';

declare module '#app' {
  interface NuxtApp {
    $firebase: {
      app: FirebaseApp;
      auth: Auth;
      messaging: Messaging;
    };
  }
}

export {};
