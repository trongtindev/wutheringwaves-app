<script setup lang="ts">
import dayjs from 'dayjs';
import urlSlug from 'url-slug';
import { CardPoolType, type IBanner } from '~/interfaces/banner';
import { Bar, Line } from 'vue-chartjs';
import type { IBannerSummary } from '~/interfaces/convene';

// uses
const api = useApi();
const i18n = useI18n();
const resources = useResources();

// fetch
const banners = await resources.getBanners();
const summaryData = ref<IBannerSummary[]>();
const activeBanners = ref<IBanner[]>([]);
const displayBanner = ref<IBanner>();

// states
const chartInitialized = ref(false);
const types = ref([
  {
    name: 'Featured resonator',
    cardPoolType: CardPoolType['featured-resonator']
  },
  {
    name: 'Featured weapon',
    cardPoolType: CardPoolType['featured-weapon']
  },
  {
    name: 'Standard resonator',
    cardPoolType: CardPoolType['standard-resonator']
  },
  {
    name: 'Standard weapon',
    cardPoolType: CardPoolType['standard-weapon']
  }
]);
const filterType = ref<number>();
const filterBanner = ref<string>();

// computed
const summary = computed(() => {
  if (displayBanner.value && summaryData.value) {
    return summaryData.value.find(
      (e) => e.banner === displayBanner.value!.name
    );
  }
  return undefined;
});

const bannerType = computed(() => {
  if (displayBanner.value) {
    if (
      [
        CardPoolType['featured-weapon'],
        CardPoolType['standard-weapon']
      ].includes(displayBanner.value.type)
    ) {
      return 'weapons';
    }
  }
  return 'characters';
});

const pbdRange = computed(() => {
  if (displayBanner.value && displayBanner.value.time) {
    const timeStart = dayjs(displayBanner.value.time.start);
    const timeEnd = dayjs(displayBanner.value.time.end);
    const diff = timeEnd.diff(timeStart, 'days') + 1;
    return Array.from(Array(diff).keys()).map((i) => {
      return timeStart.add(i, 'day');
    });
  }

  return Array.from(Array(14).keys()).map((i) => {
    return dayjs().subtract(14 - i, 'day');
  });
});

const pbdLabels = computed(() => {
  return pbdRange.value.map((e) => {
    return e.format('MM-DD');
  });
});

const pbdDatasets = computed(() => {
  return pbdLabels.value.map((label) => {
    if (summary.value) {
      const match = summary.value.pullByDay.find((e) => {
        return e.time.endsWith(label);
      });
      if (match) return match.total;
    }
    return 0;
  });
});

const rateRange = computed(() => {
  return Array.from(Array(90).keys()).map((i) => {
    return i + 1;
  });
});

const rateLabels = computed(() => {
  return rateRange.value;
});

const rateDatasets = computed(() => {
  let chance: number[] = [];
  let totalPull: number[] = [];

  if (summary.value) {
    chance = summary.value.avgPity.map((e) => e.chance);
    totalPull = summary.value.avgPity.map((e) => e.totalPull);
  }

  return [chance, totalPull];
});

const rcLabels = computed(() => {
  if (summary.value) {
    return summary.value.avgRc.map((e) => {
      return e.item;
    });
  }

  return [];
});

const rcDatasets = computed(() => {
  if (summary.value) {
    const avgRc = summary.value.avgRc;
    return Array.from(Array(8).keys()).map((i) => {
      return avgRc
        .map((e) => {
          return e.stacks[i];
        })
        .flatMap((e) => e);
    });
  }

  return [];
});

const fiveStarList = computed(() => {
  if (summary.value) {
    return summary.value.fiveStarList.map((e) => {
      const slug = urlSlug(e.item);
      return {
        ...e,
        icon: `/${e.resourceType == 'Weapon' ? 'weapons' : 'characters'}/icons/${slug}.webp`
      };
    });
  }
  return undefined;
});

const fourStarList = computed(() => {
  if (summary.value) {
    return summary.value.fourStarList.map((e) => {
      const slug = urlSlug(e.item);
      return {
        ...e,
        icon: `/${e.resourceType == 'Weapon' ? 'weapons' : 'characters'}/icons/${slug}.webp`
      };
    });
  }
  return undefined;
});

const totalPull = computed(() => {
  if (summary.value) {
    return summary.value.totalPull;
  }
  return 0;
});

const totalUsers = computed(() => {
  if (summary.value) {
    return summary.value.totalUsers;
  }
  return 0;
});

const totalSummoned = computed(() => {
  if (
    displayBanner.value &&
    displayBanner.value.featuredRare &&
    summary.value
  ) {
    const featuredRare = displayBanner.value.featuredRare;
    const item = summary.value.fiveStarList.find((e) => {
      return featuredRare === e.item;
    });
    if (item) return item.total;
  }
  return 0;
});

// functions
const initialize = () => {
  api
    .getInstance()
    .get<{ items: IBannerSummary[] }>('/convenes/summary')
    .then((result) => {
      summaryData.value = result.data.items;
    });

  filterType.value ??= CardPoolType['featured-resonator'];
  displayBanner.value = activeBanners.value.find((e) => {
    return e.name === filterBanner.value;
  });
};

// changes
watch(
  () => filterType.value,
  (value) => {
    const now = dayjs();
    activeBanners.value = banners.filter((e) => {
      if (e.time) {
        if (dayjs(e.time.start) > now) {
          return false;
        }
      }
      return e.type === value;
    });
    if (activeBanners.value.length > 0) {
      filterBanner.value = activeBanners.value[0].name;
    }
  }
);

watch(() => filterBanner.value, initialize);

// lifecycle
onMounted(initialize);
onNuxtReady(async () => {
  const {
    Chart: ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale
  } = await import('chart.js');

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale
  );
  chartInitialized.value = true;
});

// seo meta
const title = i18n.t('meta.convene.global.title');
const description = i18n.t('meta.convene.global.description');

useApp().title = i18n.t('convene.global.title');
useHead({ title });
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title')
        },
        {
          to: '/convene-history/global',
          title: i18n.t('Global')
        }
      ]"
    />

    <client-only>
      <div v-if="chartInitialized">
        <!-- filter -->
        <v-row class="mt-1">
          <v-col cols="12" sm="4">
            <v-select
              v-model="filterType"
              :items="types"
              :label="$t('Type')"
              :hide-details="true"
              item-title="name"
              item-value="cardPoolType"
            />
          </v-col>

          <v-col cols="12" sm="8">
            <v-select
              v-model="filterBanner"
              :items="activeBanners"
              :label="$t('Banner')"
              :hide-details="true"
              item-title="name"
              item-value="name"
            />
          </v-col>
        </v-row>

        <!-- thumbnails -->
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-card>
              <v-responsive :aspect-ratio="16 / 9" class="rounded">
                <v-img
                  v-if="displayBanner && displayBanner.thumbnail"
                  :src="displayBanner.thumbnail"
                />
              </v-responsive>
            </v-card>
          </v-col>
        </v-row>

        <!-- summary -->
        <v-row class="mt-1">
          <v-col cols="12" sm="9">
            <v-row>
              <v-col cols="12" sm="7">
                <v-card class="fill-height d-flex">
                  <v-card-text>
                    <table>
                      <tr>
                        <td class="py-4 pl-4 pr-2 text-center">
                          <v-avatar :size="128" rounded>
                            <v-img
                              v-if="displayBanner && displayBanner.featuredRare"
                              :src="`/${bannerType}/icons/${urlSlug(displayBanner.featuredRare)}.webp`"
                            />
                          </v-avatar>
                        </td>

                        <td class="pl-2 pr-2 text-h3" style="width: 50%">
                          <div class="d-flex justify-end w-100">
                            {{ formatNumber(totalSummoned) }}
                          </div>
                        </td>

                        <td class="pr-4" style="width: 30%">
                          <div class="w-100">
                            <div class="text-h6">
                              <span v-if="displayBanner">
                                {{ displayBanner.featuredRare }}
                              </span>
                              <span v-else>...</span>
                            </div>
                            <div class="text-gray-400">
                              {{ $t('common.summoned') }}
                            </div>
                            <p class="text-gray-400">0% won 50:50</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="5">
                <v-card class="fill-height d-flex align-center">
                  <div class="w-100">
                    <table class="w-100">
                      <tr>
                        <td
                          style="width: 60%"
                          class="text-rarity5 py-4 pl-4 pr-2 text-right"
                        >
                          <div class="w-100 text-h3">0%</div>
                        </td>

                        <td style="width: 40%" class="text-rarity5 py-4 pr-4">
                          <div>★★★★★</div>
                          <div>
                            Total
                            {{
                              fiveStarList
                                ? formatNumber(fiveStarList.length)
                                : 0
                            }}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="width: 60%"
                          class="text-rarity4 py-4 pl-4 pr-2 text-right"
                        >
                          <div class="w-100 text-h3">0%</div>
                        </td>
                        <td style="width: 40%" class="text-rarity4 py-4 pr-4">
                          <div>★★★★</div>
                          <div>
                            Total
                            {{
                              fourStarList
                                ? formatNumber(fourStarList.length)
                                : 0
                            }}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3">
            <v-card class="fill-height">
              <v-list>
                <v-list-item :title="$t('convene.global.median')">
                  <template #append> 0 </template>
                </v-list-item>
                <v-list-item :title="$t('convene.global.totalUsers')">
                  <template #append>
                    {{ formatNumber(totalUsers) }}
                  </template>
                </v-list-item>
                <v-list-item :title="$t('convene.global.conveneTotal')">
                  <template #append>
                    {{ formatNumber(totalPull) }}
                  </template>
                </v-list-item>
                <v-list-item :title="$t('common.astrite')">
                  <template #append>
                    {{ formatNumber(totalPull * 160) }}
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <!-- pullByDay -->
        <v-card class="mt-2">
          <v-card-text>
            <Line
              id="pullByDay"
              :options="{
                responsive: true
              }"
              :data="{
                labels: pbdLabels,
                datasets: [
                  {
                    label: i18n.t('convene.global.pullByDay'),
                    backgroundColor: '#4e7cff',
                    borderColor: '#4e7cff',
                    data: pbdDatasets
                  }
                ]
              }"
            />
          </v-card-text>
        </v-card>

        <!-- rate -->
        <v-card class="mt-2">
          <v-card-text>
            <Bar
              id="rate"
              :options="{
                responsive: true,
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: false
                  }
                }
              }"
              :data="{
                labels: rateLabels,
                datasets: [
                  {
                    type: 'line' as any,
                    data: rateDatasets[0],
                    label: i18n.t('convene.global.chance'),
                    backgroundColor: '#4e7cff',
                    borderColor: '#4e7cff'
                  },
                  {
                    type: 'bar',
                    data: rateDatasets[1],
                    label: i18n.t('convene.global.totalPull'),
                    backgroundColor: '#ffb13f'
                  }
                ]
              }"
            />
          </v-card-text>
        </v-card>

        <!-- rc -->
        <v-card class="mt-2">
          <v-card-text>
            <Bar
              id="rc"
              :options="{
                responsive: true,
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true
                  }
                }
              }"
              :data="{
                labels: rcLabels,
                datasets: [
                  {
                    data: rcDatasets[0],
                    label: 'S0',
                    backgroundColor: '#dddddd'
                  },
                  {
                    data: rcDatasets[1],
                    label: 'S1',
                    backgroundColor: '#f24a72'
                  },
                  {
                    data: rcDatasets[2],
                    label: 'S2',
                    backgroundColor: '#fdaf75'
                  },
                  {
                    data: rcDatasets[3],
                    label: 'S3',
                    backgroundColor: '#eaea7f'
                  },
                  {
                    data: rcDatasets[4],
                    label: 'S4',
                    backgroundColor: '#6cc4a1'
                  },
                  {
                    data: rcDatasets[5],
                    label: 'S5',
                    backgroundColor: '#4d96ff'
                  },
                  {
                    data: rcDatasets[6],
                    label: 'S6',
                    backgroundColor: '#ff6fb5'
                  },
                  {
                    data: rcDatasets[7],
                    label: '> S6',
                    backgroundColor: '#ab46d2'
                  }
                ]
              }"
            />
          </v-card-text>
        </v-card>

        <v-row class="mt-1">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-rarity5">
                {{ $t('convene.global.fiveStar') }}
              </v-card-title>
              <v-divider />

              <v-sheet v-if="fourStarList">
                <convene-history-global-list-item
                  v-for="(element, index) of fiveStarList"
                  :key="index"
                  :data="element"
                  :rarity="5"
                  class="mt-2"
                />
              </v-sheet>
              <v-card-text v-else>
                {{ $t('common.noRecords') }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-rarity4">
                {{ $t('convene.global.fourStar') }}
              </v-card-title>
              <v-divider />

              <v-sheet v-if="fourStarList">
                <convene-history-global-list-item
                  v-for="(element, index) of fourStarList"
                  :key="index"
                  :data="element"
                  :rarity="4"
                  class="mt-2"
                />
              </v-sheet>
              <v-card-text v-else>
                {{ $t('common.noRecords') }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </client-only>
  </div>
</template>
