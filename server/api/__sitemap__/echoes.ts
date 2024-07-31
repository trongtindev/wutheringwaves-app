import data from '~/resources/echoes.json';

export default defineSitemapEventHandler(() => {
  return data.items
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
