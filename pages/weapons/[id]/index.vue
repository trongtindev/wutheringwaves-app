<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { IItem } from '~/interfaces/item';

const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

// states
const dictItems = ref<{ [key: number]: IItem }>({});

// fetch
const items = await resources.getItems();
const weapons = await resources.weapons();
const item = weapons.find((e) => e.slug == route.params.id);
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getWeaponData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const skillDescription = computed(() => {
  return data.skill.description.replace(
    /\{(\d+)\}/g,
    (_, j) => data.skill.params[j] || ''
  );
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
  type: item.type
});
const ogImage = `${runtimeConfig.public.SITE_URL}/weapons/icons/${item.slug}.webp`;

useHead({ title });

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage
});

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${runtimeConfig.public.SITE_URL}/weapons/icons/${item.slug}.webp`,
  license: `${runtimeConfig.public.SITE_URL}/license`,
  acquireLicensePage: `${runtimeConfig.public.SITE_URL}/license/#how-to-use`,
  creditText: 'Wuthering Waves',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  },
  copyrightNotice: 'trongtindev'
});
</script>

<template>
  <div v-if="item && data">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/weapons',
          title: i18n.t('weapons.title')
        },
        {
          to: `/weapons/${item.slug}`,
          title: i18n.t(item.name)
        }
      ]"
    />

    <!-- upcoming -->
    <v-alert
      v-if="item.upcoming"
      color="warning"
      class="mb-4"
      :title="$t('common.upcomingContent')"
      :text="$t('common.upcomingContentMessage')"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t(item.name) }}
        </template>

        <template #actions>
          <contribute-button path="/tree/main/resources" />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-sheet class="border rounded hidden-sm-and-down">
              <v-responsive :aspect-ratio="1">
                <v-img
                  :src="`/weapons/icons/${item.slug}.webp`"
                  :alt="item.name"
                />
              </v-responsive>
            </v-sheet>

            <div class="hidden-md-and-up">
              <v-img
                class="border rounded"
                :src="`/weapons/icons/${item.slug}.webp`"
                :alt="item.name"
                :width="128"
                :height="128"
              />
            </div>
          </v-col>

          <v-col cols="12" md="8">
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="item.type" />
            </div>

            <div>
              <v-sheet v-if="data.stats.atk" class="border rounded mt-2 pa-2">
                <v-row>
                  <v-col cols="6"> ATK </v-col>
                  <v-col cols="6">
                    {{ data.stats.atk }}
                  </v-col>
                </v-row>
              </v-sheet>

              <v-sheet
                v-if="data.stats.critRate"
                class="border rounded mt-2 pa-2"
              >
                <v-row>
                  <v-col cols="6"> {{ $t('common.critRate') }} </v-col>
                  <v-col cols="6">
                    {{ data.stats.critRate }}
                  </v-col>
                </v-row>
              </v-sheet>

              <v-sheet
                v-if="data.stats.critRate"
                class="border rounded mt-2 pa-2"
              >
                <v-row>
                  <v-col cols="6"> {{ $t('common.critDMG') }} </v-col>
                  <v-col cols="6">
                    {{ data.stats.critDMG }}
                  </v-col>
                </v-row>
              </v-sheet>

              <v-sheet
                v-if="data.stats.energy"
                class="border rounded mt-2 pa-2"
              >
                <v-row>
                  <v-col cols="6"> {{ $t('common.energy') }} </v-col>
                  <v-col cols="6">
                    {{ data.stats.energy }}
                  </v-col>
                </v-row>
              </v-sheet>
            </div>

            <div v-if="data.skill" class="mt-2">
              {{ skillDescription }}
            </div>

            <div v-if="data.description" class="mt-2">
              {{ data.description }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Ranks -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('weapons.ranks') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-alert
          v-for="(element, index) in data.ranks"
          :key="index"
          :title="`${i18n.t('common.level')} ${index + 1}`"
          :class="{
            'mt-4': index > 0
          }"
          :text="element"
        />
      </v-card-text>
    </v-card>

    <!-- Ascension Material -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('common.ascensionMaterial') }}
      </v-card-title>
      <v-divider />

      <v-card-text
        v-for="(ascension, index) in data.ascensions.filter(
          (e) => e.cost.length > 0
        )"
        :key="index"
      >
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
                  :src="`/items/icons/${dictItems[cost.item].slug}.webp`"
                  :alt="$t(dictItems[cost.item].name)"
                  class="align-end h-100"
                  cover
                />
              </v-responsive>
              <v-divider />

              <v-card-title class="text-center">
                x{{ formatNumber(cost.quantity) }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex align-center justify-end">
        <v-btn
          :to="localePath(`/todo-list/create?type=weapon&slug=${item.slug}`)"
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
