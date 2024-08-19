/**
 * Improve your site's crawl efficiency
 * https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget#if-modified-since
 */

export default defineEventHandler((event) => {
  const excludePaths = [
    '/characters/',
    '/echoes/',
    '/items/',
    '/weapons/',
    '/guides/',
    '/trophies/',
  ];

  const path = event.path;
  const { buildNumber } = useAppConfig();
  const ifModifiedSince = event.headers.get('If-Modified-Since');
  if (!ifModifiedSince) return;

  if (
    excludePaths.find((e) => {
      return path.startsWith(e) && e.length !== path.length;
    })
  ) {
    return;
  }

  const modifiedSince = new Date(ifModifiedSince);
  if (modifiedSince.getTime() >= buildNumber) {
    setResponseStatus(event, 304);
    return {};
  }
});
