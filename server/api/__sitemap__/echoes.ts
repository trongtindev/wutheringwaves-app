import { allEchoes } from '~/utils/resources';

export default defineSitemapEventHandler(() => {
  return allEchoes()
    .map((e) => {
      return asSitemapUrl({
        loc: `/echoes/${e.slug}`,
        images: [
          {
            loc: `/echoes/icons/${e.slug}.webp`,
            title: `${e.name} avatar`,
          },
        ],
        lastmod: e.modifiedTime,
        _i18nTransform: true,
      });
    })
    .flatMap((e) => e);
});
