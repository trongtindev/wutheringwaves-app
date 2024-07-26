import RSS from 'rss';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { IPost } from '~/interfaces/post';
import type { IListResponse } from '~/interfaces/api';

export default defineEventHandler(async (event) => {
  const { SITE_URL, API_URL } = useRuntimeConfig().public;
  const request = axios.create({
    baseURL: API_URL
  });
  axiosRetry(request);

  const feed = new RSS({
    title: 'WutheringWaves.app',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/guides/rss`
  });

  const result = await request.get<IListResponse<IPost>>('posts');

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
