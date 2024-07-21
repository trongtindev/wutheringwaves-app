export default defineSitemapEventHandler(async () => {
  const data = await import('~/resources/items.json');
  return data.items.map((e) => {
    return asSitemapUrl({
      loc: `/items/${e.slug}`,
      _i18nTransform: true
    });
  });
});
