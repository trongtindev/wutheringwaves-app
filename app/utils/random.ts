export const randomId = () => {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    '',
  );
};

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomArray = <T>(array: T[]) => {
  const random = Math.floor(Math.random() * array.length);
  return array[random]!;
};

export const randomUniqueArray = <T>(array: T[], amount: number) => {
  if (amount > array.length) {
    throw new Error('amount out of array');
  }
  const clone = cloneObject(array);
  const items: T[] = [];

  while (amount > items.length) {
    const random = Math.floor(Math.random() * clone.length);
    items.push(clone[random]!);
    clone.splice(random, 1);
  }

  return items;
};
