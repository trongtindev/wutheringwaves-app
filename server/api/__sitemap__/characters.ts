import characters from '~/resources/characters';

export default defineSitemapEventHandler(async () => {

  return characters
    .map((e) => {
      return asSitemapUrl({
        loc: `/characters/${e.slug}`,
        _i18nTransform: true
      });
    })
    .flatMap((e) => e);
});
