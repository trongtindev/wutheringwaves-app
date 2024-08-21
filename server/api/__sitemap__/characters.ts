import { allCharacters } from '~/utils/resources';

export default defineSitemapEventHandler(() => {
  return allCharacters()
    .map((e) => {
      return asSitemapUrl({
        loc: `/characters/${e.slug}`,
        images: [
          {
            loc: `/characters/icons/${e.slug}.webp`,
            title: `${e.name} avatar`,
          },
          {
            loc: `/characters/portraits/${e.slug}.webp`,
            title: `${e.name} portrait`,
          },
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
