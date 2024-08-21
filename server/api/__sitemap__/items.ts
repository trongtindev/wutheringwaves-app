import { allItems } from '~/utils/resources';

export default defineSitemapEventHandler(() => {
  return allItems()
    .map((e) => {
      return asSitemapUrl({
        loc: `/items/${e.slug}`,
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
