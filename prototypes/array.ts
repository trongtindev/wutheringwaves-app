Array.prototype.first = function <T>(this: Array<T>) {
  return this.length > 0 ? this[0] : undefined;
};

Array.prototype.last = function <T>(this: Array<T>) {
  return this.length > 0 ? this[this.length - 1] : undefined;
};

export {};
