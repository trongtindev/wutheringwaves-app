import items from '~~/resources/items.json';

export default defineEventHandler(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items as any[];
});
