import data from '~~/resources/echoes.json';

export default defineEventHandler(() => {
  return data.items;
});
