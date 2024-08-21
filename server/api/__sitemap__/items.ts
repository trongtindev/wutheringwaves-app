import items from '~~/resources/items.json';

export default defineSitemapEventHandler(() => {
  return items
    .map((e) => {
      return asSitemapUrl({
        loc: `/items/${e.slug}`,
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
