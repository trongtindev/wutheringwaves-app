import data from '~~/resources/weapons.json';

export default defineEventHandler(() => {
  return data.items.map((e) => {
    return {
      ...e,
      icon: `/weapons/icons/${e.slug}.webp`,
      nameLocalized: e.nameLocalized || {},
      upcoming: typeof e.upcoming === 'undefined' ? false : e.upcoming,
    };
  });
});
