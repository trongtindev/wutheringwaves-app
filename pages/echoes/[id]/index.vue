<script setup lang="ts">
// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// states
const echoes = await resources.getEchoes();
const item = echoes.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });
const data = await resources.getEchoData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const skillDescription = computed(() => {
  return data.skill.description;
  // const params = [data.skill.params[0], `${data.skill.cd}`];
  // return data.skill.description.replace(
  //   /\{(\d+)\}/g,
  //   (_, index) => params[index]
  // );
});

const relatedEchoes = computed(() => {
  return echoes.filter((e) => {
    return e.attribute == item.attribute && e.name != item.name;
  });
});

// seo meta
const title = `${i18n.t('common.echo')}: ${nameLocalized.value}`;
const description = i18n.t('meta.echoes.description', {
  name: nameLocalized.value,
  rarity: item.class
});
const ogImage = `${runtimeConfig.public.SITE_URL}/echoes/icons/${item.slug}.webp`;

useApp().title = i18n.t('echoes.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
  articlePublishedTime: item.publishedTime,
  articleModifiedTime: item.modifiedTime
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  thumbnailUrl: ogImage,
  dateCreated: item.publishedTime,
  datePublished: item.modifiedTime
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  }
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: useRuntimeConfig().public.SITE_URL
    },
    { '@type': 'ListItem', position: 2, name: i18n.t('echoes.title') }
  ]
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
      :github="`tree/main/resources/echoes/${item.slug}.json`"
    />

    <!-- page -->
    <v-card>
      <v-card-title tag="h1">
        {{ nameLocalized }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img :src="`/echoes/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="`${item.cost} ${$t('echoes.cost')}`" />
              <v-chip :text="$t(item.class)" />
              <v-chip :text="$t(item.attribute)" />
            </div>

            <div class="mt-2">
              <div :innerHTML="skillDescription"></div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Sonata Effect -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('echoes.sonataEffect') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ item.sonataEffects }}
      </v-card-text>
    </v-card>

    <!-- related -->
    <v-card v-if="relatedEchoes.length > 0" class="mt-2">
      <v-card-title tag="h2">
        {{ $t('echoes.related', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col
            v-for="(element, index) in relatedEchoes"
            :key="index"
            cols="6"
            sm="4"
            md="2"
          >
            <echo-card :item="element" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- comments -->
    <div class="mt-2">
      <comments :channel="`echo.${item.slug}`" />
    </div>
  </div>
</template>
