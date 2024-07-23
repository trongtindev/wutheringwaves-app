<script setup lang="ts">
import dayjs from 'dayjs';
import { mdiCake, mdiMapMarker, mdiSword, mdiPistol } from '@mdi/js';
import { useGoTo } from 'vuetify';

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();
const goTo = useGoTo({ offset: -72, duration: 500 });

// fetch
const characters = await resources.getCharacters();
const item = characters.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ message: '1', statusCode: 404 });

const data = await resources.getCharacterData(item.slug);
if (!data) throw createError({ message: '2', statusCode: 404 });

// states
const tab = ref('overview');

// computed
const stats = computed(() => {
  if (!data.stats) return [];

  return [
    {
      label: 'atk',
      value: data.stats.atk
    },
    {
      label: 'def',
      value: data.stats.def
    },
    {
      label: 'hp',
      value: data.stats.hp
    },
    {
      label: 'critRate',
      value: 5
    },
    {
      label: 'critDMG',
      value: 150
    }
  ];
});

const weaponIcon = computed(() => {
  switch (item.weapon) {
    case 'Pistols':
      return mdiPistol;
  }
  return mdiSword;
});

const nameLocalized = computed(() => {
  // if (data.nameLocalized && data.nameLocalized[i18n.locale.value]) {
  //   return data.nameLocalized[i18n.locale.value];
  // }
  return i18n.t(item.name);
});

const quoteLocalized = computed(() => {
  if (data.quoteLocalized && data.quoteLocalized[i18n.locale.value]) {
    return data.quoteLocalized[i18n.locale.value];
  }
  return data.quote;
});

const descriptionLocalized = computed(() => {
  if (
    data.descriptionLocalized &&
    data.descriptionLocalized[i18n.locale.value]
  ) {
    return data.descriptionLocalized[i18n.locale.value];
  }
  return data.description;
});

const moreBuildGuides = computed(() => {
  return characters.filter((e) => e.attribute && e.attribute == item.attribute);
});

// changes
watch(
  () => tab.value,
  (elementId) => {
    goTo(`#${elementId}`);
  }
);

// seo meta
const title = i18n.t('meta.characters.id.title', { name: nameLocalized.value });
const description = i18n.t('meta.characters.id.description', {
  name: nameLocalized.value,
  attribute: item.attribute
});
const ogImage = `${runtimeConfig.public.SITE_URL}/characters/icons/${item.slug}.webp`;

useApp().title = i18n.t('characters.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  ogImage: ogImage,
  description,
  ogDescription: description,
  articlePublishedTime: item.publishedTime,
  articleModifiedTime: item.modifiedTime
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  thumbnailUrl: ogImage,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime
});
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${runtimeConfig.public.SITE_URL}/characters/icons/${item.slug}.webp`,
  license: `${runtimeConfig.public.SITE_URL}/license`,
  acquireLicensePage: `${runtimeConfig.public.SITE_URL}/license/#how-to-use`,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  },
  copyrightNotice: 'trongtindev'
}));
</script>

<template>
  <!-- chips -->
  <header-chips
    class="mb-2"
    :github="`/tree/main/resources/characters/${item.slug}.json`"
  />

  <!-- upcoming -->
  <v-alert
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
        title: i18n.t('characters.title')
      }
    ]"
  />

  <!-- page -->
  <v-card>
    <v-card-title tag="h1" :class="`text-rarity${item.rarity}`">
      {{ title }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="d-flex justify-center align-center">
          <v-img
            :src="`/characters/portraits/${item.slug}.webp`"
            :alt="nameLocalized"
            :height="256"
          />
        </v-col>

        <v-col cols="12" md="8">
          <div>
            <h2
              class="text-body-2"
              :innerHTML="
                $t('characters.introduction', {
                  name: nameLocalized,
                  rarity: item.rarity,
                  attribute: item.attribute,
                  weaponType: item.weapon
                })
              "
            />
          </div>

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

          <!-- stats -->
          <div v-if="stats.length > 0" class="mt-2">
            <v-sheet
              v-for="(element, index) in stats"
              :key="index"
              :class="{ 'mt-2': index > 0 }"
              class="pa-2 border rounded"
            >
              <v-row>
                <v-col cols="3">
                  {{ $t(`common.${element.label}`) }}
                </v-col>
                <v-col> {{ formatNumber(element.value) }} </v-col>
              </v-row>
            </v-sheet>
          </div>

          <!-- summary -->
          <div class="d-flex flex-wrap ga-2 mt-2">
            <v-chip
              v-if="data.birthplace"
              :text="$t(data.birthplace)"
              :prepend-icon="mdiMapMarker"
            />
            <v-chip
              v-if="data.birthday"
              :text="data.birthday"
              :prepend-icon="mdiCake"
            />
            <v-chip
              v-if="item.weapon"
              :text="$t(item.weapon)"
              :prepend-icon="weaponIcon"
            />
            <v-chip v-if="item.attribute" :text="$t(item.attribute)" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider v-if="item.modifiedTime" />
    <v-card-actions v-if="item.modifiedTime">
      <h2 class="text-center text-body-2 w-100">
        {{
          $t('characters.lastUpdatedOn', {
            name: nameLocalized,
            time: dayjs(item.modifiedTime)
          })
        }}
      </h2>
    </v-card-actions>
  </v-card>

  <!-- Tab views -->
  <div id="overview">
    <characters-profile :item="item" :data="data" />
  </div>
  <div id="build">
    <characters-build :item="item" :data="data" />
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
  <v-card class="mt-2">
    <v-card-title>
      {{ $t('characters.moreBuildGuides') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
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
    </v-card-text>
  </v-card>

  <!-- comments -->
  <div class="mt-2">
    <comments :channel="`character.${item.slug}`" />
  </div>

  <!-- navigation -->
  <v-bottom-navigation v-model="tab" :grow="true">
    <v-btn value="overview" :text="$t('characters.overview')" />
    <v-btn
      value="build"
      :text="$t('characters.build', { name: nameLocalized })"
    />
    <v-btn value="teams" :text="$t('characters.teams')" />
    <v-btn value="calculations" :text="$t('characters.calculations')" />
  </v-bottom-navigation>
</template>
