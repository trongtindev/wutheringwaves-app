export default defineSitemapEventHandler(async () => {
  const data = await import('~/resources/weapons.json');
  return data.items.map((e) => {
    return asSitemapUrl({
      loc: `/weapons/${e.slug}`,
      _i18nTransform: true
    });
  });
});
