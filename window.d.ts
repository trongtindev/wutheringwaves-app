type Callback = <T>(result: T, error?: string) => void;

declare global {
  interface Window {
    electron: {
      on: <T>(channel: string, listener: (data: T) => void) => void;
      emit: <T1, T2>(
        channel: string,
        data?: T1,
        callback?: (result: T2, error?: string) => void
      ) => void;
    };
  }
}
export {};
