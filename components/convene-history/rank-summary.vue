<script setup lang="ts">
import type { IListResponse } from '~/interfaces/api';
import { CardPoolType } from '~/interfaces/banner';
import type { IBannerSummary } from '~/interfaces/convene';

// define
// const props = defineProps<{}>();

// uses
const api = useApi();

// states
const banners = ref<IBannerSummary[]>([]);
const luckinessFiveStar = ref(0);
const luckinessFourStar = ref(0);

// functions
const calculatorLuckiness = (types: CardPoolType[], rarity: number) => {
  const matchBanners = banners.value
    .filter((e) => {
      return types.includes(e.cardPoolType);
    })
    .flatMap((e) => {
      if (rarity >= 5) {
        return e.fiveStarWinRate;
      }
      return e.fourStarWinRate;
    });
  const totalPlayers = matchBanners.reduce((previous, e) => {
    return previous + e[1];
  }, 0);
  const expectedValue =
    matchBanners.reduce((previous, e) => {
      return previous + e[0] * e[1];
    }, 0) / totalPlayers;
  const luckierComparison = matchBanners.map((e) => {
    const difference = e[0] - expectedValue;
    return { rate: e[0], difference, count: e[1] };
  });

  console.log({ totalPlayers, expectedValue, luckierComparison });
};

// lifecycle
onNuxtReady(() => {
  api
    .getInstance()
    .get<IListResponse<IBannerSummary>>('/convenes/summary')
    .then((result) => {
      banners.value = result.data.items;

      calculatorLuckiness(
        [
          CardPoolType['featured-resonator'],
          CardPoolType['standard-resonator']
        ],
        4
      );
      calculatorLuckiness(
        [
          CardPoolType['featured-resonator'],
          CardPoolType['standard-resonator']
        ],
        5
      );
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
            {{ $t('convene.rank.more', { percentage: 0 }) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                {{ $t('convene.rank.top') }}
              </div>
              <div class="text-h6 font-weight-bold">
                {{ luckinessFiveStar }}%
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
</template>
