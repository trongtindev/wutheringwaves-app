import items from '~/resources/items';

export default defineSitemapEventHandler(async () => {
  return items.map((e) => {
    return asSitemapUrl({
      loc: `/items/${e.slug}`,
      _i18nTransform: true
    });
  });
});
