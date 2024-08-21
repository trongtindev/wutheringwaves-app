<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import moment from 'moment';
import type { IItem } from '~/interfaces/item';
import type { IWeaponDataStats } from '~/interfaces/weapon';

// Property 'formatNumber' does not exist on type
const format = formatNumber;
const { SITE_URL } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const localePath = useLocalePath();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// fetch
const items = await resources.getItems();
const weapons = await resources.getWeapons();
const item = weapons.find((e) => e.slug == route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getWeaponData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// states
const dictItems = ref<{ [key: number]: IItem }>({});
const previewStats = ref<IWeaponDataStats>();

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const skillDescription = computed(() => {
  const lastIndex = data.skill.params.length - 1;
  return data.skill.description.replace(
    /\{(\d+)\}/g,
    (_, j) => data.skill.params[lastIndex][j] || '',
  );
});

const stats = computed(() => {
  return [
    ...(data.stats.hp
      ? [
          {
            label: 'hp',
            value: `${data.stats.hp}%`,
          },
        ]
      : []),
    ...(data.stats.def
      ? [
          {
            label: 'def',
            value: `${data.stats.def}%`,
          },
        ]
      : []),
    ...(data.stats.atk
      ? [
          {
            label: 'atk',
            value: `${data.stats.atk}%`,
          },
        ]
      : []),
    {
      label: 'atk',
      value: `${data.stats.atkFlat}`,
    },
    ...(data.stats.critRate
      ? [
          {
            label: 'critRate',
            value: `${data.stats.critRate}%`,
          },
        ]
      : []),
    ...(data.stats.critDMG
      ? [
          {
            label: 'critDMG',
            value: `${data.stats.critDMG}%`,
          },
        ]
      : []),
  ];
});

const ascensions = computed(() => {
  return data.ascensions || [];
});

// lifecycle
onMounted(() => {
  data.ascensions.forEach((e) => {
    e.cost.forEach((cost) => {
      const item = items.find((item) => item.id === cost.item);
      if (item) dictItems.value[cost.item] = item;
    });
  });
});

// seo meta
const title = `${i18n.t('Weapon')}: ${nameLocalized.value}`;
const description = i18n.t('meta.weapons.id.description', {
  name: nameLocalized.value,
  type: item.type,
});
const ogImage = `${SITE_URL}/weapons/icons/${item.slug}.webp`;

useAppBar().title = i18n.t('weapons.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
  articlePublishedTime: item.publishedTime,
  articleModifiedTime: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  thumbnailUrl: ogImage,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${SITE_URL}/weapons/icons/${item.slug}.webp`,
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
    { '@type': 'ListItem', position: 2, name: i18n.t('weapons.title') },
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
    <header-chips class="mb-2" :github="`tree/main/resources/weapons.json`" />

    <!-- upcoming -->
    <base-alert
      v-if="item.upcoming"
      color="warning"
      :title="$t('common.upcomingContent')"
      :text="$t('common.upcomingContentMessage')"
    />

    <v-card>
      <v-card-title tag="h1" :class="`text-rarity${item.rarity}`">
        {{ nameLocalized }}
      </v-card-title>
      <v-card-subtitle tag="h2">
        {{
          $t('weapons.lastUpdatedOn', {
            name: nameLocalized,
            time: moment(item.modifiedTime),
          })
        }}
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-sheet class="d-flex align-center justify-center">
              <v-img
                :src="`/weapons/icons/${item.slug}.webp`"
                :alt="nameLocalized"
                :width="256"
                :height="256"
              />
            </v-sheet>
          </v-col>

          <v-col cols="12" md="8">
            <!-- introduction -->
            <div>
              <h2
                class="text-body-2"
                :innerHTML="
                  $t('weapons.introduction', {
                    name: nameLocalized,
                    rarity: item.rarity,
                  })
                "
              />
            </div>

            <div v-if="data.description" class="mt-2">
              {{ data.description }}
            </div>

            <!-- stats -->
            <v-table class="border rounded mt-2">
              <thead>
                <tr>
                  <th colspan="3" class="ma-2 text-center font-weight-bold">
                    {{ $t('common.stats') }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(element, j) in stats" :key="j">
                  <td class="w-50 text-center">
                    {{ $t(`common.${element.label}`) }}
                  </td>
                  <td class="w-50 text-center">
                    {{ element.value }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Skill -->
    <v-card v-if="data.skill" class="mt-2">
      <v-card-title tag="h2">
        {{ $t('weapons.skill', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <div :innerHTML="skillDescription" />
      </v-card-text>
    </v-card>

    <!-- Ascension Material -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('common.ascensionMaterial') }}
      </v-card-title>
      <v-divider />

      <v-card-text v-for="(ascension, index) in ascensions" :key="index">
        <v-row>
          <v-col cols="12" sm="3" md="2">
            <v-card
              class="d-flex align-center justify-center text-center text-h6 fill-height pa-2"
            >
              Lv. {{ ascension.minLevel }}
            </v-card>
          </v-col>

          <v-col
            v-for="(cost, j) in ascension.cost"
            :key="j"
            cols="4"
            sm="3"
            md="2"
          >
            <v-card
              :to="
                dictItems[cost.item]
                  ? localePath(`/items/${dictItems[cost.item].slug}`)
                  : `/items`
              "
            >
              <v-responsive :aspect-ratio="1">
                <v-img
                  v-if="dictItems[cost.item]"
                  :src="dictItems[cost.item].icon"
                  :alt="$t(dictItems[cost.item].name)"
                  class="align-end h-100"
                  cover
                />
              </v-responsive>
              <v-divider />

              <v-card-title class="text-center">
                x{{ format(cost.quantity) }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex align-center justify-end">
        <v-btn
          :to="
            localePath({
              path: '/todo-list/create',
              meta: {
                weapon: item.slug,
              },
            })
          "
          :text="$t('Add to Todo list')"
          :append-icon="mdiPlus"
          variant="outlined"
        />
      </v-card-actions>
    </v-card>

    <div class="mt-2">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
