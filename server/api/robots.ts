export default defineEventHandler((event) => {
  const { SITE_URL } = useRuntimeConfig().public;

  const content = ['User-agent: *', 'Allow: /'];
  content.push(`Sitemap: ${SITE_URL}/sitemap_index.xml`);

  // block AhrefsBot
  content.push('\n');
  content.push(`User-agent: AhrefsBot`);
  content.push(`Disallow: /`);

  // block SemrushBot
  content.push('\n');
  content.push(`User-agent: SemrushBot`);
  content.push(`Disallow: /`);

  setResponseHeader(event, 'content-type', 'text/plain');
  return content.join('\n');
});
