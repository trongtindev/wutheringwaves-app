import type * as L from 'leaflet';

declare global {
  interface Window {
    // leaflet
    leaflet: typeof L;
    // leafletMap: typeof L.map;

    // tinymce
    tinymce: import('tinymce').EditorManager;

    // electron
    electron: {
      on: <T>(
        eventName: string,
        listener: (data: T, callback?: () => Promise<void> | void) => void,
      ) => void;
      emit: <T1, T2>(
        eventName: string,
        data?: T1,
        callback?: (result: T2, error?: string) => Promise<void> | void,
      ) => void;
    };
  }
}

export {};
