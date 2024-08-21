import { allItems } from '~/utils/resources';

export default defineEventHandler(() => {
  const items = allItems();
  return {
    total: items.length,
    items: items,
  };
});
