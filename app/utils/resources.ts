import weapons from '~~/resources/weapons.json';
import items from '~~/resources/items.json';
import characters from '~~/resources/characters.json';
import echoes from '~~/resources/echoes.json';
import attributes from '~~/resources/attributes.json';
import sonatas from '~~/resources/sonata.json';

export const allAttributes = () => {
  return attributes.items.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export const allSonatas = () => {
  return sonatas.items.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export const allWeapons = () => {
  return weapons.items
    .map((e) => {
      return {
        ...e,
        icon: `/weapons/icons/${e.slug}.webp`,
        nameLocalized: e.nameLocalized || {},
        upcoming: typeof e.upcoming === 'undefined' ? false : e.upcoming,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
};

export const allItems = () => {
  return (items.items as any[]).map((e) => {
    return {
      ...e,
      icon: `${useRuntimeConfig().public.FILE_URL}/assets/items/${e.slug}_${e.id}.webp`,
      nameLocalized: e.nameLocalized || {},
      publishedTime: e.publishedTime || '2024-05-23T00:00:00.000Z',
    };
  });
};

export const allCharacters = () => {
  return characters.items.map((e) => {
    return {
      ...e,
      nameLocalized: e.nameLocalized || {},
      hidden: typeof e.hidden === 'undefined' ? false : e.hidden,
      upcoming: typeof e.upcoming === 'undefined' ? false : e.upcoming,
    };
  });
};

export const allEchoes = () => {
  const attrs = allAttributes();
  const sonatas = allSonatas();

  return echoes.items
    .map((e) => {
      return {
        ...e,
        icon: `/echoes/icons/${e.slug}.webp`,
        nameLocalized: e.nameLocalized || {},
        attribute: attrs.find((item) => {
          return item.slug === e.attribute || item.name === e.attribute;
        })!,
        sonataEffects: e.sonataEffects.map((sonataEffect) => {
          return sonatas.find((item) => {
            return item.slug === sonataEffect || item.name === sonataEffect;
          })!;
        }),
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
};
