import RSS from 'rss';
import axios from 'axios';
import type { IPost } from '~/interfaces/post';

export default defineEventHandler(async (event) => {
  const { SITE_URL, API_URL } = useRuntimeConfig().public;

  const feed = new RSS({
    title: 'WutheringWaves.app',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/api/rss`
  });
  const result = await axios.get<{
    items: IPost[];
  }>(`${API_URL}/posts`);

  for (const item of result.data.items) {
    feed.item({
      guid: item.id,
      title: item.title,
      url: `${SITE_URL}/guides/${item.slug}`,
      description: item.description,
      date: item.createdAt
    });
  }

  const feedString = feed.xml({ indent: true });
  event.node.res.setHeader('content-type', 'text/xml');
  event.node.res.end(feedString);
});

