export default defineSitemapEventHandler(async () => {
  const data = await import('~/resources/echos.json');
  return data.items.map((e) => {
    return asSitemapUrl({
      loc: `/echos/${e.slug}`,
      _i18nTransform: true
    });
  });
});
