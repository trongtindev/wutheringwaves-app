import data from '~/resources/trophy_items.json';

export default defineSitemapEventHandler(async () => {
  return data.items.map((e) => {
    return asSitemapUrl({
      loc: `/trophies/${e.slug}`,
      _i18nTransform: true,
    });
  });
});
