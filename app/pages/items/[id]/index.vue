<script setup lang="ts">
// Property 'formatNumber' does not exist on type
const parse = parseContent;
const { SITE_URL, SITE_NAME } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const localePath = useLocalePath();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// states
const items = await resources.getItems();
const itemDict = items.reduce((acc, e) => ((acc[e.name] = e), acc), {});
const item = items.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getItemData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const nameLocalized = (() => {
  return item.nameLocalized[i18n.locale.value] || item.name;
})();

const title = (() => {
  return i18n.t('meta.items.id.title', { name: nameLocalized });
})();

const description = computed(() => {
  if (item.name.toLowerCase().includes('recipe')) {
    return i18n.t('meta.items.id.description.recipe', {
      name: nameLocalized,
    });
  }
  return i18n.t('meta.items.id.description.default', {
    name: nameLocalized,
  });
});

const obtainDescriptionLocalized = (() => {
  const content =
    data.obtainDescriptionLocalized &&
    data.obtainDescriptionLocalized[i18n.locale.value]
      ? data.obtainDescriptionLocalized[i18n.locale.value]
      : data.obtainDescription;

  if (content) {
    return content;
  } else if (item.name.toLowerCase().includes('waveband')) {
    return i18n.t('items.obtainedFromConvenes', {
      item: nameLocalized,
      character: '?',
    });
  }
  return null;
})();

const relatedItems = (() => {
  return shuffleArray(items)
    .filter((e) => e.category == item.category)
    .splice(0, 24);
})();

// seo meta
useAppBar().title = i18n.t('items.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: item.icon,
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
  url: `${SITE_URL}/items/${item.slug}`,
  image: item.icon,
  thumbnailUrl: item.icon,
  description: description.value,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: item.icon,
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

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-img :src="item.icon" :height="256" />
          </v-col>

          <v-col>
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
                    :src="itemDict[element.item].icon"
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

      <v-card-text>
        <v-row>
          <v-col
            v-for="element in relatedItems"
            :key="element.slug"
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
