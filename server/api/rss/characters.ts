import RSS from 'rss';
import characters from '~/resources/characters.json';

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const { SITE_URL } = useRuntimeConfig().public;

  const feed = new RSS({
    title: 'WutheringWaves.app',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/api/rss`
  });

  // characters
  for (const item of characters.items) {
    feed.item({
      guid: item.slug,
      title: t('meta.characters.id.title', { name: item.name }),
      url: `${SITE_URL}/characters/${item.slug}`,
      description: t('meta.characters.id.description', {
        name: item.name,
        attribute: item.attribute
      }),
      date: item.publishedTime
    });
  }

  const feedString = feed.xml({ indent: true });
  event.node.res.setHeader('content-type', 'text/xml');
  event.node.res.end(feedString);
});
