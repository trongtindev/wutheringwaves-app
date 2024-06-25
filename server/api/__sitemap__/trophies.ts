import trophies from '~/resources/trophies';

export default defineSitemapEventHandler(async () => {
  return trophies.map((e) => {
    return asSitemapUrl({
      loc: `/trophies/${e.slug}`,
      _i18nTransform: true
    });
  });
});
