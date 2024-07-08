<script setup lang="ts">
import type { ConveneDocType } from '~/collections/convene';
import { CardPoolType } from '~/interfaces/banner';
import type { IBannerSummary } from '~/interfaces/convene';

// define
const props = defineProps<{
  convenes: ConveneDocType[];
}>();
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const api = useApi();

// states
const banners = ref<IBannerSummary[]>([]);
const pullData = ref<number[][]>([]);
const luckinessData = ref<number[][]>([]);
const luckinessFiveStar = ref(0);
const luckinessFourStar = ref(0);
const totalPullPercentage = ref(0);

// functions
const calculatorPulls = () => {
  let totalPlayers = 0;
  let playersWithFewerPulls = 0;
  const currentPulls = props.convenes.length;

  for (const data of pullData.value) {
    totalPlayers += data[1];
    if (data[0] < currentPulls) {
      playersWithFewerPulls += data[1];
    }
  }

  totalPullPercentage.value = (playersWithFewerPulls / totalPlayers) * 100;
  console.debug({ totalPlayers, currentPulls });
};

const calculatorLuckiness = () => {};

// changes
watch(
  () => props.convenes,
  () => calculatorPulls()
);

// lifecycle
onNuxtReady(() => {
  api
    .getInstance()
    .get<{
      items: IBannerSummary[];
      pullData: number[][];
      luckinessData: number[][];
    }>('/convenes/summary')
    .then((result) => {
      banners.value = result.data.items;
      pullData.value = result.data.pullData;
      luckinessData.value = result.data.luckinessData;

      calculatorPulls();
      calculatorLuckiness();

      emits('on-updated');
    });
});
</script>

<template>
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
            {{
              $t('convene.rank.more', {
                percentage: formatNumber(totalPullPercentage)
              })
            }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                {{
                  totalPullPercentage < 50
                    ? $t('convene.rank.bottom')
                    : $t('convene.rank.top')
                }}
              </div>
              <div class="text-h6 font-weight-bold">
                {{ formatNumber(100 - totalPullPercentage) }}%
              </div>
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
              <div class="text-h6 font-weight-bold">
                {{ luckinessFourStar }}%
              </div>
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
  </v-card>
</template>
