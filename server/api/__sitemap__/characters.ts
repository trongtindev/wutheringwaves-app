export default defineSitemapEventHandler(async () => {
  const data = await import('~/resources/characters.json');
  return data.items
    .map((e) => {
      return asSitemapUrl({
        loc: `/characters/${e.slug}`,
        _i18nTransform: true
      });
    })
    .flatMap((e) => e);
});
