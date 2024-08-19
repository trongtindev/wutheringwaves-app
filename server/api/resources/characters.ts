import data from '~~/resources/characters.json';
export default defineEventHandler(() => {
  return data.items;
});
