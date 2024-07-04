interface ICallback {
  result: T;
  error?: string;
}
type Handler = <T>(data: T) => Promise<void> | void;

declare global {
  interface Window {
    electron: {
      on: <T, T2>(
        event: string,
        listener: (data: T, callback?: Handler<ICallback<T2>>) => void
      ) => void;
      emit: <T1, T2>(
        event: string,
        data?: T1,
        callback?: Handler<ICallback<T2>>
      ) => void;
    };
  }
}
export {};
