import { allWeapons } from '~/utils/resources';

export default defineEventHandler(() => {
  const items = allWeapons();
  return {
    total: items.length,
    items: items,
  };
});
