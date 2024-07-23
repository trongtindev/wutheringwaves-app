<script setup lang="ts">
import { CardPoolType, type IBanner } from '@/interfaces/banner';
import { mdiChevronRight } from '@mdi/js';
import urlSlug from 'url-slug';
import dayjs from 'dayjs';
import type { ConveneDocumentConverted } from '~/interfaces/convene';

// uses
const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// states
const banners = await resources.banners();
const convenes = ref<ConveneDocumentConverted[]>([]);
const filterBanner = ref<IBanner | null>(null);
const filterRarity = ref<number[]>([5]);
const displayType = ref<'list' | 'grid'>('grid');
const displayConvenes = ref<ConveneDocumentConverted[]>([]);

// functions
const initialize = () => {
  database.getInstance().then((db) => {
    db.convenes
      .find({
        selector: {
          playerId: account.active
        }
      })
      .sort({
        createdAt: 'desc'
      })
      .exec()
      .then((result) => {
        convenes.value = result.map((e) => {
          const newObject: any = e;
          newObject.timeConverted = dayjs(e.time).utcOffset(account.timeOffset);
          return newObject;
        }) as any;

        updateFilter();
      })
      .catch(console.error);
  });
};

const updateFilter = () => {
  displayConvenes.value = convenes.value
    .filter((e) => {
      if (filterBanner.value) {
        if (e.cardPoolType !== filterBanner.value.type) {
          return false;
        }
      }
      if (filterRarity.value) {
        if (!filterRarity.value.includes(e.qualityLevel)) {
          return false;
        }
      }
      return true;
    })
    .filter((e) => {
      if (filterBanner.value) {
        if (
          filterBanner.value.time &&
          [
            CardPoolType['featured-resonator'],
            CardPoolType['featured-weapon']
          ].includes(e.cardPoolType)
        ) {
          const timeStart = dayjs(filterBanner.value.time.start)
            .utcOffset(8)
            .add(account.timeOffset - 8, 'hours');
          const timeEnd = dayjs(filterBanner.value.time.end)
            .utcOffset(8)
            .add(account.timeOffset - 8, 'hours');

          return (
            e.timeConverted >= timeStart &&
            e.timeConverted <= timeEnd &&
            filterBanner.value.type == e.cardPoolType
          );
        }
      }
      return true;
    });
};

// changes
watch(
  () => account.active,
  () => initialize()
);
watch(() => filterBanner.value, updateFilter);
watch(() => filterRarity.value, updateFilter);

// lifecycle
onNuxtReady(() => initialize());
watch(
  () => account.onConveneChanged,
  () => initialize()
);

// seo meta
const title = i18n.t('meta.convene.history.title');
const description = i18n.t('meta.convene.history.description');

useApp().title = i18n.t('convene.history.title');
useHead({ title: title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <!-- breadcrumbs -->
  <breadcrumbs
    :items="[
      {
        to: '/convene-history',
        title: i18n.t('convene.history.title')
      }
    ]"
  />

  <!-- filter -->
  <v-row class="mb-1">
    <v-col cols="12" md="8">
      <v-select
        v-model="filterBanner"
        :placeholder="$t('Select banner')"
        :items="banners"
        :return-object="true"
        :item-title="(e) => $t(e.name)"
        :clearable="true"
        :hide-details="true"
      />
    </v-col>

    <v-col cols="12" md="4">
      <v-select
        v-model="filterRarity"
        :label="$t('common.rarity')"
        :items="[5, 4, 3]"
        :multiple="true"
        :hide-details="true"
      />
    </v-col>
  </v-row>

  <v-card>
    <v-card-text>
      <v-alert
        v-if="convenes.length === 0"
        color="info"
        :text="$t('You currently have no Convene History.')"
      />

      <div v-else-if="displayType === 'list'">
        <v-data-table
          class="border rounded"
          :items="displayConvenes"
          :headers="[
            { title: $t('Time'), width: '30%' },
            { title: $t('Name'), width: '40%' },
            { title: $t('Pity'), width: '15%' },
            { title: $t('common.rarity'), width: '15%' }
          ]"
          item-value="key"
        >
          <template #item="{ item }">
            <tr :class="`bg-linear-rarity${item.qualityLevel}`">
              <td>
                {{ item.time }}
              </td>

              <td class="d-flex align-center">
                <v-avatar
                  class="border mr-2"
                  :class="`bg-rarity${item.qualityLevel}`"
                >
                  <v-img
                    :src="`/${item.resourceType.startsWith('R') ? 'characters' : 'weapons'}/icons/${urlSlug(item.name)}.webp`"
                  />
                </v-avatar>
                <span :class="`text-rarity${item.qualityLevel}`">
                  {{ $t(item.name) }}
                </span>
              </td>

              <td>
                <span
                  v-if="item.qualityLevel >= 4"
                  :style="`color: hsl(${100 - (item.pity / (item.qualityLevel === 5 ? 80 : 10)) * 100}, 100%, 50%);`"
                >
                  {{ item.pity }}
                </span>
                <span v-else>
                  {{ item.pity }}
                </span>
              </td>

              <td>
                {{ item.qualityLevel }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <!-- grid -->
      <div v-else class="d-flex flex-wrap justify-center">
        <div
          v-for="(element, index) in displayConvenes"
          :key="index"
          class="pa-2 d-flex position-relative"
        >
          <v-badge
            :color="`hsl(${100 - (element.pity / (element.qualityLevel === 5 ? 80 : 10)) * 100}, 100%, 50%)`"
            :content="element.pity"
            location="bottom right"
          >
            <v-avatar
              class="border"
              :class="`bg-rarity${element.qualityLevel}`"
              :size="64"
              :image="`/${element.resourceType.startsWith('R') ? 'characters' : 'weapons'}/icons/${urlSlug(element.name)}.webp`"
            />
          </v-badge>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <div class="mt-2">
    <masonry>
      <template #default="masonry">
        <convene-history-rank-summary
          :convenes="convenes"
          @on-updated="() => masonry.refreshLayout()"
        />

        <convene-history-banner-summary
          :title="$t('banner.featuredResonator')"
          :type="CardPoolType['featured-resonator']"
          @on-updated="() => masonry.refreshLayout()"
        />

        <convene-history-banner-summary
          :title="$t('banner.featuredWeapon')"
          :type="CardPoolType['featured-weapon']"
          @on-updated="() => masonry.refreshLayout()"
        />

        <convene-history-banner-summary
          :title="$t('banner.standardResonator')"
          :type="CardPoolType['standard-resonator']"
          @on-updated="() => masonry.refreshLayout()"
        />

        <convene-history-banner-summary
          :title="$t('banner.standardWeapon')"
          :type="CardPoolType['standard-weapon']"
          @on-updated="() => masonry.refreshLayout()"
        />

        <lazy-convene-history-chart-summary
          :convenes="convenes"
          @on-updated="() => masonry.refreshLayout()"
        />

        <v-card>
          <v-list>
            <v-list-item
              :to="localePath('/convene-history/global')"
              :title="$t('convene.global.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/showcase/convene')"
              :title="$t('showcase.convene.title')"
              :append-icon="mdiChevronRight"
            />
          </v-list>
        </v-card>
      </template>
    </masonry>
  </div>
</template>
