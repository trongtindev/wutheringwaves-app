import data from '~~/resources/items.json';

export default defineSitemapEventHandler(() => {
  return data.items
    .map((e) => {
      return asSitemapUrl({
        loc: `/items/${e.slug}`,
        images: [
          {
            loc: `/items/icons/${e.slug}.webp`,
            title: `${e.name} avatar`,
          },
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
