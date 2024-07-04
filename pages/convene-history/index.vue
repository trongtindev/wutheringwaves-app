<script setup lang="ts">
import type { ConveneDocument } from '@/collections/convene';
import { CardPoolType, type IBanner } from '@/interfaces/banner';
import {
  mdiImport,
  mdiChevronRight,
  mdiGrid,
  mdiViewList
  // mdiDownload
} from '@mdi/js';
import urlSlug from 'url-slug';

// uses
const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// states
const banners = await resources.banners();
const convenes = ref<ConveneDocument[]>([]);
const filterBanner = ref<IBanner | null>(null);
const filterRarity = ref<number[]>([5, 4]);
const displayType = ref<'list' | 'grid'>('list');
const displayConvenes = ref<ConveneDocument[]>([]);
const showExportImage = ref(false);

// computed
const totalPulls = computed(() => {
  return (convenes.value || []).length;
});

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
        // TODO: fixme
        convenes.value = result as any;
        updateFilter();
      })
      .catch(console.error);
  });
};

const updateFilter = () => {
  displayConvenes.value = convenes.value
    .filter((e) => {
      if (filterBanner.value) {
        return e.cardPoolType === filterBanner.value.type;
      }
      if (filterRarity.value) {
        return filterRarity.value.includes(e.qualityLevel);
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
          const time = dayjs(e.time);
          return (
            time >= dayjs(filterBanner.value.time.start) &&
            time <= dayjs(filterBanner.value.time.end) &&
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
onMounted(() => initialize());

// seo meta
const title = i18n.t('convene.history.title');
const description = i18n.t('meta.convene.history.description');

useApp().title = i18n.t('convene.history.title');
useHead({
  title: title,
  meta: [{}]
});
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title')
        }
      ]"
    />

    <!-- alert -->
    <alert
      id="convene.history.alert"
      color="warning"
      :text="$t('convene.history.alert')"
    />

    <!-- page -->
    <page-header>
      <template #actions>
        <v-btn-toggle v-model="displayType" color="primary" variant="outlined">
          <v-btn :icon="mdiViewList" value="list" />
          <v-btn :icon="mdiGrid" value="grid" />
        </v-btn-toggle>

        <v-btn
          :text="$t('common.import')"
          :append-icon="mdiImport"
          :to="localePath('/convene-history/import')"
        />
      </template>
    </page-header>
    <!-- actions -->

    <v-card>
      <v-card-text>
        <div class="mb-2">
          <v-row>
            <v-col cols="12" md="8">
              <v-select
                v-model="filterBanner"
                :placeholder="$t('Select banner')"
                :items="banners"
                :return-object="true"
                :item-title="(e) => $t(e.name)"
                :clearable="true"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="filterRarity"
                :label="$t('common.rarity')"
                :items="[5, 4, 3]"
                :multiple="true"
              />
            </v-col>
          </v-row>
        </div>

        <v-alert
          v-if="convenes.length === 0"
          type="info"
          :text="$t('You currently have no Convene History.')"
        />

        <div v-else-if="displayType === 'list'" ref="exportElement">
          <v-data-table
            class="border rounded"
            :items="displayConvenes"
            :headers="[
              {
                title: $t('Time'),
                width: '20%'
              },
              { title: $t('Pity'), width: '10%' },
              { title: $t('Name'), width: '30%' },
              {
                title: $t('Type'),
                key: 'resourceType'
              },
              {
                title: $t('Rarity'),
                key: 'rarity'
              }
            ]"
            item-value="key"
          >
            <template #item="{ item }">
              <tr :class="`bg-linear-rarity${item.qualityLevel}`">
                <td>
                  {{ item.time }}
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
                  [{{ item.cardPoolType }}]
                  {{ $t(item.resourceType) }}
                </td>

                <td>
                  {{ item.qualityLevel }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>

        <!-- grid -->
        <div v-else ref="gridElement" class="d-flex flex-wrap justify-center">
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

      <!-- <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :text="$t('common.exportAsImage')"
          :prepend-icon="mdiDownload"
          @click="() => (showExportImage = true)"
        />
      </v-card-actions> -->
    </v-card>

    <div class="mt-2">
      <v-row>
        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Featured resonator')"
            :type="CardPoolType['featured-resonator']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Featured weapon')"
            :type="CardPoolType['featured-weapon']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Standard resonator')"
            :type="CardPoolType['standard-resonator']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Standard weapon')"
            :type="CardPoolType['standard-weapon']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('convene.rank.title') }}
            </v-card-title>
            <v-divider />

            <v-card-text>
              <!-- Total pulls -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.totalPull') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.more', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness Win Rate -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luckWinRateOff') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness 5★ -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luck5') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center text-legendary">
                      <div class="mr-2">
                        {{ $t('Top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness 4★ -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luck4') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.lessLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center text-rare">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>
            </v-card-text>
            <v-divider />

            <v-card-actions class="d-flex align-center justify-center">
              <div class="d-flex align-center flex-column">
                <v-btn-toggle variant="outlined" divided>
                  <v-btn :text="$t('Resonator')" />
                  <v-btn :text="$t('Weapon')" />
                  <v-btn :text="$t('Standard')" />
                </v-btn-toggle>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card :to="localePath('/convene-history/global')">
            <v-card-title>
              <v-row>
                <v-col>
                  {{ $t('convene.global.title') }}
                </v-col>

                <v-col class="d-flex justify-end align-center">
                  <v-icon :icon="mdiChevronRight" :size="24" />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>

          <v-card :to="localePath('/showcase/convene')" class="mt-2">
            <v-card-title>
              <v-row>
                <v-col>
                  {{ $t('showcase.convene.title') }}
                </v-col>

                <v-col class="d-flex justify-end align-center">
                  <v-icon :icon="mdiChevronRight" :size="24" />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- <v-dialog
      v-model="showExportImage"
      :width="720"
      :scrollable="true"
      :persistent="true"
    >
      <convene-history-export-image :items="displayConvenes" />
    </v-dialog> -->
  </div>
</template>
