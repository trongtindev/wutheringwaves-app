<script setup lang="ts">
import type { ConveneDocument } from '~/database/documents/convene';
import { CardPoolType, type IBanner } from '~/interfaces/banner';
import type { IBannerSummary } from '~/interfaces/convene';
import { mdiArrowUp, mdiArrowDown } from '@mdi/js';

// define
const props = defineProps<{
  banners: IBanner[];
  convenes: ConveneDocument[];
}>();
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const api = useApi();
const account = useAccount();

// states
const summaries = ref<IBannerSummary[]>([]);
const pullData = ref<number[][]>([]);
const totalPull = ref(0);
const totalPullPercentage = ref('~');
const totalPullMoreThanPercentage = ref('~');
const luckinessData = ref<number[][]>([]);
const luckiness = ref(0);
const luckinessPercentage = ref('~');
const luckinessMoreThanPercentage = ref('~');
const fourAvgData = ref<number[][]>([]);
const fourAvg = ref(0);
const fourAvgPercentage = ref('~');
const fourAvgMoreThanPercentage = ref('~');
const fiveAvg = ref(0);
const fiveAvgData = ref<number[][]>([]);
const fiveAvgPercentage = ref('~');
const fiveAvgMoreThanPercentage = ref('~');

// computed
const fiveAvgProgress = computed(() => {
  return 100 - fiveAvg.value;
});

const fourAvgProgress = computed(() => {
  return 100 - fourAvg.value;
});

// functions
const initialize = () => {
  api
    .get<{
      items: IBannerSummary[];
      pullData: number[][];
      luckinessData: number[][];
      fourAvgData: number[][];
      fiveAvgData: number[][];
    }>('/convenes/summary')
    .then((result) => {
      summaries.value = result.data.items;
      pullData.value = result.data.pullData;
      luckinessData.value = result.data.luckinessData;
      fourAvgData.value = result.data.fourAvgData;
      fiveAvgData.value = result.data.fiveAvgData;

      updateStatistics();

      emits('on-updated');
    });
};

const updateStatistics = () => {
  updatePulls();
  updateWinRate();
  updateAvg();
};

const updatePulls = () => {
  let totalPlayers = 0;
  let playersWithFewer = 0;

  for (const data of pullData.value) {
    totalPlayers += data[1];
    if (data[0] <= props.convenes.length) {
      playersWithFewer += data[1];
    }
  }

  totalPull.value = (playersWithFewer / totalPlayers) * 100;
  if (isNaN(totalPull.value)) totalPull.value = 0;
  totalPullPercentage.value = formatNumber(totalPull.value);
  totalPullMoreThanPercentage.value = formatNumber(100 - totalPull.value);
};

const updateWinRate = () => {
  const winRate = calculateWinRate({
    type: CardPoolType['featured-resonator'],
    convenes: props.convenes
      .filter((e) => e.cardPoolType === CardPoolType['featured-resonator'])
      .map((e) => {
        return {
          time: e.time,
          name: e.name,
          resourceId: e.resourceId,
          resourceType: e.resourceType,
          qualityLevel: e.qualityLevel,
          cardPoolType: e.cardPoolType,
        };
      }),
    banners: props.banners,
    timeOffset: account.timeOffset,
    qualityLevel: 5,
  });

  let totalPlayers = 0;
  let playersWithFewer = 0;

  for (const data of luckinessData.value) {
    totalPlayers += data[1];
    if (data[0] <= winRate) {
      playersWithFewer += data[1];
    }
  }

  luckiness.value = (playersWithFewer / totalPlayers) * 100;
  if (isNaN(luckiness.value)) luckiness.value = 0;
  luckinessPercentage.value = formatNumber(luckiness.value);
  luckinessMoreThanPercentage.value = formatNumber(100 - luckiness.value);
};

const updateAvg = () => {
  const avg = calculateAvg({
    convenes: props.convenes
      .filter((e) => e.cardPoolType === CardPoolType['featured-resonator'])
      .map((e) => {
        return {
          time: e.time,
          name: e.name,
          resourceId: e.resourceId,
          resourceType: e.resourceType,
          qualityLevel: e.qualityLevel,
          cardPoolType: e.cardPoolType,
        };
      }),
  });
  console.log(avg);

  if (avg.fourAvg >= 0) {
    let totalPlayers = 0;
    let playersWithFewer = 0;

    for (const data of fourAvgData.value) {
      totalPlayers += data[1];
      if (data[0] <= avg.fourAvg) {
        playersWithFewer += data[1];
      }
    }

    fourAvg.value = (playersWithFewer / totalPlayers) * 100;
    fourAvgPercentage.value = formatNumber(fourAvg.value);
    fourAvgMoreThanPercentage.value = formatNumber(100 - fourAvg.value);
  }

  if (avg.fiveAvg >= 0) {
    let totalPlayers = 0;
    let playersWithFewer = 0;

    for (const data of fiveAvgData.value) {
      totalPlayers += data[1];
      if (data[0] <= avg.fiveAvg) {
        playersWithFewer += data[1];
      }
    }

    fiveAvg.value = (playersWithFewer / totalPlayers) * 100;
    fiveAvgPercentage.value = formatNumber(fiveAvg.value);
    fiveAvgMoreThanPercentage.value = formatNumber(100 - fiveAvg.value);
  }
};

// changes
watch(
  () => props.convenes,
  () => updateStatistics(),
);

// lifecycle
onNuxtReady(initialize);
</script>

<template>
  <v-card :title="$t('convene.rank.title')">
    <v-card-text>
      <!-- Total pulls -->
      <v-alert class="rounded-be-0 rounded-bs-0">
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('common.totalPull') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{
              $t('convene.rank.more', {
                percentage: totalPullPercentage,
              })
            }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                <v-icon :icon="totalPull > 50 ? mdiArrowUp : mdiArrowDown" />
              </div>
              <div
                class="text-h6 font-weight-bold"
                :style="`color: hsl(${(totalPull / 100) * 100}, 100%, 50%);`"
              >
                {{ totalPullMoreThanPercentage }}%
              </div>
            </div>
          </template>
        </v-list-item>
      </v-alert>
      <v-progress-linear
        :model-value="totalPull"
        class="mb-4 rounded-be-lg rounded-bs-lg bg-background"
      />

      <!-- Luckiness Win -->
      <v-alert class="rounded-be-0 rounded-bs-0">
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('convene.rank.luckWinRateOff') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{
              $t('convene.rank.moreLuck', { percentage: luckinessPercentage })
            }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                <v-icon :icon="luckiness > 50 ? mdiArrowUp : mdiArrowDown" />
              </div>
              <div
                class="text-h6 font-weight-bold"
                :style="`color: hsl(${(luckiness / 100) * 100}, 100%, 50%);`"
              >
                {{ luckinessMoreThanPercentage }}%
              </div>
            </div>
          </template>
        </v-list-item>
      </v-alert>
      <v-progress-linear
        :model-value="luckiness"
        class="mb-4 rounded-be-lg rounded-bs-lg bg-background"
      />

      <!-- Luckiness 5★ -->
      <v-alert
        :class="{
          'mb-4': fiveAvgProgress <= 0,
          'rounded-be-0 rounded-bs-0': fiveAvgProgress > 0,
        }"
      >
        <v-list-item class="pa-0">
          <v-list-item-title class="text-rarity5">
            {{ $t('convene.rank.luck5') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{
              $t('convene.rank.moreLuck', {
                percentage: fiveAvgMoreThanPercentage,
              })
            }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center text-legendary">
              <div class="mr-2">
                <v-icon :icon="fiveAvg < 50 ? mdiArrowUp : mdiArrowDown" />
              </div>
              <div
                class="text-h6 font-weight-bold"
                :style="`color: hsl(${100 - (fiveAvg / 100) * 100}, 100%, 50%);`"
              >
                {{ fiveAvgPercentage }}%
              </div>
            </div>
          </template>
        </v-list-item>
      </v-alert>
      <v-progress-linear
        v-if="fiveAvgProgress > 0"
        :model-value="fiveAvgProgress"
        class="mb-4 rounded-be-lg rounded-bs-lg bg-background"
      />

      <!-- Luckiness 4★ -->
      <v-alert :class="{ 'rounded-be-0 rounded-bs-0': fourAvgProgress > 0 }">
        <v-list-item class="pa-0">
          <v-list-item-title class="text-rarity4">
            {{ $t('convene.rank.luck4') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{
              $t('convene.rank.moreLuck', {
                percentage: fourAvgMoreThanPercentage,
              })
            }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                <v-icon :icon="fourAvg < 50 ? mdiArrowUp : mdiArrowDown" />
              </div>
              <div
                class="text-h6 font-weight-bold"
                :style="`color: hsl(${100 - (fourAvg / 100) * 100}, 100%, 50%);`"
              >
                {{ fourAvgPercentage }}%
              </div>
            </div>
          </template>
        </v-list-item>
      </v-alert>

      <v-progress-linear
        v-if="fourAvgProgress > 0"
        :model-value="fourAvgProgress"
        class="rounded-be-lg rounded-bs-lg bg-background"
      />
    </v-card-text>
  </v-card>
</template>
