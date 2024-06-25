import echos from '~/resources/echos';

export default defineSitemapEventHandler(async () => {
  return echos.map((e) => {
    return asSitemapUrl({
      loc: `/echos/${e.slug}`,
      _i18nTransform: true
    });
  });
});
