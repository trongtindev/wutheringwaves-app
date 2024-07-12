declare global {
  interface Window {
    chrome: {
      webview: {
        addEventListener(
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | AddEventListenerOptions
        ): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postMessage(message: any): void;
        postMessageWithAdditionalObjects(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message: any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          additionalObjects: ArrayLike<any>
        ): void;
        releaseBuffer(buffer: ArrayBuffer): void;
        removeEventListener(
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: boolean | EventListenerOptions
        ): void;
      };
    };
  }
}

declare global {
  interface Window {
    electron: {
      on: <T, T2>(
        event: string,
        listener: (data: T, callback?: () => Promise<void> | void) => void
      ) => void;
      emit: <T1, T2>(
        event: string,
        data?: T1,
        callback?: () => Promise<void> | void
      ) => void;
    };
  }
}

export {};
