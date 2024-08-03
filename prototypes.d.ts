declare global {
  interface Array<T> {
    first(): T;
  }
}

declare global {
  interface Array<T> {
    last(): T;
  }
}

export {};
