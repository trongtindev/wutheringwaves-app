import data from '~/resources/echos.json';

export default defineSitemapEventHandler(() => {
  return data.items
    .map((e) => {
      return asSitemapUrl({
        loc: `/echos/${e.slug}`,
        images: [
          {
            loc: `/echos/icons/${e.slug}.webp`,
            title: `${e.name} avatar`
          }
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true
      });
    })
    .flatMap((e) => e);
});
