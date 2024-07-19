<script setup lang="ts">
import dayjs from 'dayjs';
import {
  mdiCake,
  mdiMapMarker,
  mdiSword,
  mdiPistol,
  mdiAccountGroupOutline,
  mdiInformationSlabCircle,
  mdiChartBellCurve,
  mdiMapMarkerPath
} from '@mdi/js';

const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// fetch
const characters = await resources.characters();
const item = characters.find((e) => e.slug === route.params.id);
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getCharacterData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// states
const tab = ref(0);

// computed
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
  articlePublishedTime: data.publishedTime,
  articleModifiedTime: data.modifiedTime
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
    { '@type': 'ListItem', position: 2, name: i18n.t('characters.title') }
  ]
});
</script>

<template>
  <div v-if="item && data">
    <!-- upcoming -->
    <v-alert
      v-if="item.upcoming"
      color="warning"
      class="mb-2"
      :title="$t('common.upcomingContent')"
      :text="$t('common.upcomingContentMessage')"
    />

    <v-card>
      <card-title>
        <template #title>
          <div :class="`text-rarity${item.rarity}`">
            <span> {{ i18n.t(item.name) }}</span>
            <span class="ml-2"> {{ item.rarity }} ★ </span>
          </div>
        </template>

        <template #actions>
          <edit-this-page
            :path="`/tree/main/resources/characters/${item.slug}.json`"
          />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="d-flex justify-center align-center">
            <v-img
              :src="`/characters/portraits/${item.slug}.webp`"
              :alt="i18n.t(item.name)"
              :height="256"
            />
          </v-col>

          <v-col cols="12" md="8">
            <div>
              <span
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

            <div v-if="data.stats" class="mt-2">
              <v-sheet class="pa-2 border rounded">
                <v-row>
                  <v-col cols="3"> HP </v-col>
                  <v-col> {{ data.stats.hp }} </v-col>
                </v-row>
              </v-sheet>

              <v-sheet v-if="data.stats.def" class="pa-2 border rounded mt-2">
                <v-row>
                  <v-col cols="3"> DEF </v-col>
                  <v-col> {{ data.stats.def }} </v-col>
                </v-row>
              </v-sheet>

              <v-sheet v-if="data.stats.def" class="pa-2 border rounded mt-2">
                <v-row>
                  <v-col cols="3"> ATK </v-col>
                  <v-col> {{ data.stats.atk }} </v-col>
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

      <v-divider v-if="data.modifiedTime" />
      <v-card-actions v-if="data.modifiedTime">
        <div class="text-center text-subtitle-2 w-100">
          {{
            $t('characters.lastUpdatedOn', {
              name: nameLocalized,
              time: dayjs(data.modifiedTime)
            })
          }}
        </div>
      </v-card-actions>
    </v-card>

    <!-- Tabs -->
    <div class="mt-2">
      <client-only>
        <v-tabs v-model="tab" :stacked="true" :grow="true">
          <v-tab>
            <v-icon :icon="mdiInformationSlabCircle" :size="32" />
            <span>{{ $t('common.profile') }}</span>
          </v-tab>

          <v-tab>
            <v-icon :icon="mdiMapMarkerPath" :size="32" />
            <span>{{ $t('common.build') }}</span>
          </v-tab>

          <v-tab>
            <v-icon :icon="mdiAccountGroupOutline" :size="32" />
            <span>{{ $t('common.gameplayAndTeams') }}</span>
          </v-tab>

          <v-tab>
            <v-icon :icon="mdiChartBellCurve" :size="32" />
            <span>{{ $t('common.calculations') }}</span>
          </v-tab>
        </v-tabs>
      </client-only>
    </div>

    <!-- Tab views -->
    <div :class="{ hidden: tab != 0 }">
      <characters-profile :item="item" :data="data" />
    </div>

    <div class="mt-4">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
