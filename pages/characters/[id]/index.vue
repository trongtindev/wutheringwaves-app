<script setup lang="ts">
import dayjs from 'dayjs';
import { useGoTo } from 'vuetify';

const { SITE_URL, SITE_NAME } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const goTo = useGoTo({ offset: -72, duration: 500 });
const showPicture = ref(0);
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// fetch
const echoes = await resources.getEchoes();
const weapons = await resources.getWeapons();
const characters = await resources.getCharacters();
const item = characters.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ message: '1', statusCode: 404 });

const data = await resources.getCharacterData(item.slug);
if (!data) throw createError({ message: '2', statusCode: 404 });

// states
const tab = ref('overview');

// computed
const pictures = [
  item.images.portrait,
  ...(data.splashArt ? [`/characters/splash-art/${item.slug}.webp`] : []),
  item.images.icon,
];

const nameLocalized = item.nameLocalized[i18n.locale.value] || item.name;

const quoteLocalized = (() => {
  if (data.quoteLocalized && data.quoteLocalized[i18n.locale.value]) {
    return data.quoteLocalized[i18n.locale.value];
  }
  return data.quote;
})();

const descriptionLocalized = (() => {
  if (
    data.descriptionLocalized &&
    data.descriptionLocalized[i18n.locale.value]
  ) {
    return data.descriptionLocalized[i18n.locale.value];
  }
  return data.description;
})();

const moreBuildGuides = (() => {
  return characters.filter((e) => {
    return e.attribute && e.attribute == item.attribute && !e.hidden;
  });
})();

const lastUpdatedOn = dayjs(item.modifiedTime);

// changes
watch(
  () => tab.value,
  (elementId) => {
    goTo(`#${elementId}`);
  },
);

// seo meta
const title = i18n.t('meta.characters.id.title', { name: nameLocalized });
const description = i18n.t('meta.characters.id.description', {
  name: nameLocalized,
  attribute: item.attribute.name,
});
const ogImage = `${SITE_URL}${item.images.icon}`;

useAppBar().title = i18n.t('characters.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  ogImage: ogImage,
  description,
  ogDescription: description,
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
  url: `${SITE_URL}/characters/${item.slug}`,
  image: ogImage,
  thumbnailUrl: ogImage,
  description,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${SITE_URL}/${item.images.icon}`,
  license: `${SITE_URL}/license`,
  acquireLicensePage: `${SITE_URL}/license/#how-to-use`,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves',
  },
  copyrightNotice: 'trongtindev',
}));

if (data.splashArt) {
  useJsonld(() => ({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${SITE_URL}/characters/splash-art/${item.slug}.webp`,
    license: `${SITE_URL}/license`,
    acquireLicensePage: `${SITE_URL}/license/#how-to-use`,
    creditText: 'WutheringWaves.app',
    creator: {
      '@type': 'Organization',
      name: 'Wuthering Waves',
    },
    copyrightNotice: 'trongtindev',
  }));
}

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
      :github="`tree/main/resources/characters/${item.slug}.json`"
      :translate="{ type: 'character', slug: item.slug }"
    />

    <!-- upcoming -->
    <base-alert
      v-if="item.upcoming"
      color="warning"
      class="mb-2"
      :title="$t('common.upcomingContent')"
      :text="$t('common.upcomingContentMessage')"
    />

    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/characters',
          title: i18n.t('characters.title'),
        },
      ]"
    />

    <!-- page -->
    <v-card>
      <v-card-title tag="h1" :class="`text-rarity${item.rarity}`">
        {{ title }}
      </v-card-title>
      <v-card-subtitle class="lastUpdatedOn">
        {{
          $t('characters.lastUpdatedOn', {
            name: nameLocalized,
            time: lastUpdatedOn,
          })
        }}
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div>
              <a
                :href="pictures[showPicture]"
                :title="nameLocalized"
                target="_blank"
              >
                <v-img
                  :aspect-ratio="4 / 3"
                  :src="pictures[showPicture]"
                  :alt="nameLocalized"
                />
              </a>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <h2
              class="text-body-2"
              :innerHTML="
                $t('characters.introduction', {
                  name: nameLocalized,
                  rarity: item.rarity,
                  attribute: item.attribute.name,
                  weaponType: item.weapon,
                })
              "
            />

            <div
              v-if="quoteLocalized"
              class="quote mt-2"
              :innerHTML="quoteLocalized"
            />

            <div
              v-if="descriptionLocalized"
              class="mt-2"
              :innerHTML="descriptionLocalized"
            />

            <!-- information -->
            <characters-information :item :data />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tab views -->
    <div id="overview">
      <characters-overview :item="item" :name-localized :data="data" />
    </div>

    <div id="build">
      <characters-build
        :item="item"
        :name-localized
        :data="data"
        :echoes="echoes"
        :weapons="weapons"
      />
    </div>

    <div id="teams">
      <characters-teams
        :item="item"
        :data="data"
        :name-localized="nameLocalized"
      />
    </div>

    <characters-ascension :item="item" :data="data" />

    <!-- moreBuildGuides -->
    <section-title>
      <template #title>
        {{ $t('characters.moreBuildGuides') }}
      </template>
    </section-title>

    <div>
      <v-row>
        <v-col
          v-for="(element, index) in moreBuildGuides"
          :key="index"
          cols="6"
          sm="4"
          md="2"
        >
          <character-card
            :item="element"
            :custom-name="`${element.name} Build`"
          />
        </v-col>
      </v-row>
    </div>

    <!-- comments -->
    <comments class="mt-2" :channel="`character.${item.slug}`" />

    <!-- navigation -->
    <v-bottom-navigation v-model="tab" :grow="true" class="border-t">
      <v-btn value="overview" :text="$t('characters.overview')" />
      <v-btn
        value="build"
        :text="$t('characters.build', { name: nameLocalized })"
      />
      <v-btn value="teams" :text="$t('characters.teams')" />
      <v-btn value="calculations" :text="$t('characters.calculations')" />
    </v-bottom-navigation>
  </div>
</template>
