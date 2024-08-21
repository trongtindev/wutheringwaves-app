import { allWeapons } from '~/utils/resources';

export default defineSitemapEventHandler(() => {
  return allWeapons()
    .map((e) => {
      return asSitemapUrl({
        loc: `/weapons/${e.slug}`,
        images: [
          {
            loc: `/weapons/icons/${e.slug}.webp`,
            title: `${e.name} avatar`,
          },
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
