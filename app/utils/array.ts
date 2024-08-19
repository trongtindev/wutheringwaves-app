export const anyOf = <T>(a: T[], b: T[]) => {};

export const arrayToObject = <T>(array: T[], key: (e: T) => string) => {
  return Object.fromEntries(array.map((e) => [key(e), e]));
};
