import data from '~/resources/trophy_items.json';
export default defineEventHandler(() => {
  return data.items;
});
