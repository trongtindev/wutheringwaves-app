<script setup lang="ts">
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// Property 'formatNumber' does not exist on type
const parse = parseContent;

// states
const items = await resources.getItems();
const itemDict = items.reduce((acc, e) => ((acc[e.name] = e), acc), {});
const item = items.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getItemData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const title = computed(() => {
  return i18n.t('meta.items.id.title', { name: nameLocalized.value });
});

const description = computed(() => {
  if (item.name.toLowerCase().includes('recipe')) {
    return i18n.t('meta.items.id.description.recipe', {
      name: nameLocalized.value,
    });
  }
  return i18n.t('meta.items.id.description.default', {
    name: nameLocalized.value,
  });
});

const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const obtainDescriptionLocalized = computed(() => {
  const content =
    data.obtainDescriptionLocalized &&
    data.obtainDescriptionLocalized[i18n.locale.value]
      ? data.obtainDescriptionLocalized[i18n.locale.value]
      : data.obtainDescription;

  if (content) {
    return content;
  } else if (item.name.toLowerCase().includes('waveband')) {
    return i18n.t('items.obtainedFromConvenes', {
      item: nameLocalized.value,
      character: '?',
    });
  }
  return null;
});

const relatedItems = computed(() => {
  return shuffleArray(items)
    .filter((e) => e.category == item.category)
    .splice(0, 24);
});

// seo meta
const ogImage = `${runtimeConfig.public.SITE_URL}/items/icons/${item.slug}.webp`;

useAppBar().title = i18n.t('items.title');
useHead({ title: title.value });
useSeoMeta({
  ogType: 'article',
  ogTitle: title.value,
  description,
  ogDescription: description,
  ogImage,
  articlePublishedTime: item.publishedTime,
  articleModifiedTime: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title.value,
  thumbnailUrl: ogImage,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  license: `${runtimeConfig.public.SITE_URL}/license`,
  acquireLicensePage: `${runtimeConfig.public.SITE_URL}/license/#how-to-use`,
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
    { '@type': 'ListItem', position: 2, name: i18n.t('items.title') },
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
      :github="`tree/main/resources/items/${item.slug}.json`"
    />

    <!-- page -->
    <v-card>
      <v-card-title tag="h1">
        {{ nameLocalized }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="`/items/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="item.id.toString()" />
              <v-chip :text="item.category" />
            </div>

            <div class="mt-2">
              {{ data.description }}
            </div>

            <div v-if="data.bgDescription" class="mt-2">
              <div :innerHTML="data.bgDescription"></div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mt-1">
      <v-col v-if="obtainDescriptionLocalized" cols="12" md="6">
        <!-- obtain -->
        <v-card class="fill-height">
          <v-card-title tag="h2">
            {{ $t('items.howToObtain', [nameLocalized]) }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div :innerHTML="parse(obtainDescriptionLocalized)"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="data.unlockDescription" cols="12" md="6">
        <!-- unlock -->
        <v-card class="fill-height">
          <v-card-title tag="h2">
            {{ $t('items.howToUnlock', [nameLocalized]) }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div :innerHTML="parse(data.unlockDescription)"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="data.cookingIngredients" cols="12" md="6">
        <!-- cookingIngredients -->
        <v-card class="fill-height">
          <v-card-title tag="h2">
            {{ $t('items.cookingIngredients') }}
          </v-card-title>
          <v-divider />

          <div class="mt-3 mb-3">
            <v-list-item
              v-for="(element, index) in data.cookingIngredients"
              :key="index"
              :to="localePath(`/items/${itemDict[element.item].slug}`)"
              :title="itemDict[element.item].name"
              :subtitle="`x${element.quantity}`"
              target="_blank"
            >
              <template #prepend>
                <v-avatar class="border" rounded>
                  <v-img
                    v-if="itemDict[element.item]"
                    :src="`/items/icons/${itemDict[element.item].slug}.webp`"
                  />
                </v-avatar>
              </template>
            </v-list-item>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- related -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('common.related') }} {{ item.name }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col
            v-for="(element, index) in relatedItems"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <item-card :item="element" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- comments -->
    <div class="mt-2">
      <comments :channel="`item.${item.slug}`" />
    </div>
  </div>
</template>
