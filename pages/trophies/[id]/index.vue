<script setup lang="ts">
const { SITE_URL, SITE_NAME } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// states
const item = await resources.getTrophy(`${route.params.id}`);
if (!item) throw createError({ statusCode: 404 });

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

// seo meta
const title = `${i18n.t('common.trophy')}: ${nameLocalized.value}`;
const description = i18n.t(item.description);
const ogImage = `${SITE_URL}/trophies/icons/${item.slug}.webp`;

useAppBar().title = i18n.t('trophies.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512-maskable.png`,
  },
  url: `${SITE_URL}/trophies/${item.slug}`,
  image: ogImage,
  thumbnailUrl: ogImage,
  description,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  license: `${SITE_URL}/license`,
  acquireLicensePage: `${SITE_URL}/license/#how-to-use`,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves',
  },
  copyrightNotice: 'trongtindev',
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: useRuntimeConfig().public.SITE_URL,
    },
    { '@type': 'ListItem', position: 2, name: i18n.t('trophies.title') },
  ],
});

// https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget#if-modified-since
if (headers['if-modified-since']) {
  const modifiedSince = new Date(headers['if-modified-since']);
  const modifiedTime = new Date(item.modifiedTime);
  if (modifiedSince.getTime() >= modifiedTime.getTime()) {
    setResponseStatus(event!, 304);
  }
}
</script>

<template>
  <div>
    <!-- chips -->
    <header-chips
      class="mb-2"
      :github="`tree/main/resources/trophies.json`"
    />

    <v-card>
      <v-card-title tag="h2">
        {{ i18n.t(item.name) }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-img
              :src="`/trophies/icons/${item.slug}.webp`"
              :height="256"
            />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="item.group" />
              <v-chip :text="item.category" />
            </div>

            <div class="mt-2">
              {{ item.description }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div class="mt-2">
      <comments :channel="`trophy.${item.slug}`" />
    </div>
  </div>
</template>
