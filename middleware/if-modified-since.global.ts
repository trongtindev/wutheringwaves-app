/**
 * Improve your site's crawl efficiency
 * https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget#if-modified-since
 */

export default defineNuxtRouteMiddleware((to) => {
  const excludePaths = [
    '/characters/',
    '/echoes/',
    '/items/',
    '/weapons/',
    '/guides/',
    '/trophies/',
  ];

  if (
    excludePaths.find((e) => {
      return to.path.startsWith(e) && e.length !== to.path.length;
    })
  ) {
    return;
  }

  const headers = useRequestHeaders(['If-Modified-Since']);
  if (headers['if-modified-since']) {
    const { buildNumber } = useAppConfig();
    const modifiedSince = new Date(headers['if-modified-since']);

    if (modifiedSince.getTime() >= buildNumber) {
      abortNavigation({ statusCode: 304 });
    }
  }
});
