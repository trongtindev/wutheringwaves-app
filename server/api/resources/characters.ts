import { allCharacters } from '~/utils/resources';

export default defineEventHandler(() => {
  const items = allCharacters();
  return {
    total: items.length,
    items: items,
  };
});
