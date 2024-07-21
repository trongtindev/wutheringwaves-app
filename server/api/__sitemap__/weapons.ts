import data from '~/resources/weapons.json';

export default defineSitemapEventHandler(() => {
  return data.items
    .map((e) => {
      return asSitemapUrl({
        loc: `/weapons/${e.slug}`,
        images: [
          {
            loc: `/weapons/icons/${e.slug}.webp`,
            title: `${e.name} avatar`
          }
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true
      });
    })
    .flatMap((e) => e);
});
