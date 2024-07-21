export default defineSitemapEventHandler(async () => {
  const data = await import('~/resources/trophy_items.json');
  return data.default.items.map((e) => {
    return asSitemapUrl({
      loc: `/trophies/${e.slug}`,
      _i18nTransform: true
    });
  });
});
