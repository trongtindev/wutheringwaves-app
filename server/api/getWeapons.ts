import data from '@/resources/weapons.json';
export default defineEventHandler(() => {
  return data.items;
});
