import data from '~/resources/items.json';
export default defineEventHandler(() => {
  return data.items;
});
