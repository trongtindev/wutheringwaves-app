import { allEchoes } from '~/utils/resources';

export default defineEventHandler(() => {
  const items = allEchoes();
  return {
    total: items.length,
    items: items,
  };
});
