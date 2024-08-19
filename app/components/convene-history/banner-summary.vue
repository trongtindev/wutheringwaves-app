<script setup lang="ts">
import { CardPoolType } from '@/interfaces/banner';
import type { ConveneDocument } from '~/database/documents/convene';

// define
const props = defineProps<{
  title: string;
  type: CardPoolType;
}>();

const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const account = useAccount();
const database = useDatabase();
const resources = useResources();

// states
const convenes = ref<ConveneDocument[]>([]);
const guaranteedAt = ref(0);
const luckiness = ref(0);
const luckinessPercentage = ref<string>('~');

// computed
const guaranteedAt4 = computed<number>(() => {
  if (!convenes.value) return 0;
  const last = convenes.value.findIndex((e) => e.qualityLevel >= 4);
  return last >= 0 ? last : convenes.value.length;
});

const guaranteedAt5 = computed<number>(() => {
  if (!convenes.value) return 0;
  const last = convenes.value.findIndex((e) => e.qualityLevel >= 5);
  return last >= 0 ? last : convenes.value.length;
});

const guaranteedAt5List = computed(() => {
  if (!convenes.value) return [];
  return convenes.value.filter((e) => e.qualityLevel >= 5);
});

const showLuckWinRateOff = computed(() => {
  return [CardPoolType['featured-resonator']].includes(props.type);
});

// functions
const initialize = async () => {
  if (!account.active) return;

  convenes.value = database.convenes
    .find({
      playerId: account.active.playerId,
      cardPoolType: props.type,
    })
    .map((e) => e[1]);

  guaranteedAt.value = 80;
  updateStatistics();
};

const updateStatistics = async () => {
  if (!account.active) return;

  const banners = await resources.getBanners();
  if (showLuckWinRateOff.value) {
    luckiness.value = calculateWinRate({
      type: props.type,
      convenes: convenes.value.map((e) => {
        return {
          time: e.time,
          name: e.name,
          resourceId: e.resourceId,
          resourceType: e.resourceType,
          qualityLevel: e.qualityLevel,
          cardPoolType: e.cardPoolType,
        };
      }),
      banners,
      timeOffset: account.timeOffset,
      qualityLevel: 5,
    });
    if (isNaN(luckiness.value)) luckiness.value = 0;
    luckinessPercentage.value = formatNumber(luckiness.value);
  }

  setTimeout(() => {
    emits('on-updated');
  }, 250);
};

// changes
watch(
  () => account.active,
  () => initialize(),
);

// lifecycle
onNuxtReady(initialize);
</script>

<template>
  <v-card :title="props.title">
    <v-card-text>
      <!-- lifetime pull -->
      <v-alert class="mb-4">
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('convene.lifetimePulls') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            <span v-if="convenes">
              {{ new Intl.NumberFormat('en-US').format(convenes.length * 160) }}
            </span>
            <span v-else> 0 </span>

            <span class="ml-1">
              {{ $t('Astrite') }}
            </span>
          </v-list-item-subtitle>

          <template #append>
            <span class="text-h6 font-weight-bold">
              <span v-if="convenes">
                {{ convenes.length }}
              </span>
              <span v-else> 0 </span>
            </span>
          </template>
        </v-list-item>
      </v-alert>

      <!-- winRate -->
      <div v-if="showLuckWinRateOff">
        <v-alert class="rounded-be-0 rounded-bs-0">
          <v-list-item class="pa-0">
            <v-list-item-title>
              {{ $t('convene.rank.luckWinRateOff') }}
            </v-list-item-title>

            <template #append>
              <span
                class="text-h6 text-legendary font-weight-bold"
                :style="`color: hsl(${(luckiness / 100) * 100}, 100%, 50%);`"
              >
                {{ luckinessPercentage }}%
              </span>
            </template>
          </v-list-item>
        </v-alert>
        <v-progress-linear
          :model-value="luckiness"
          class="mb-4 rounded-be-lg rounded-bs-lg bg-background"
        />
      </div>

      <!-- 5 star pity -->
      <v-alert class="rounded-be-0 rounded-bs-0">
        <v-list-item class="pa-0">
          <v-list-item-title class="text-rarity5">
            5★ {{ $t('convene.pity') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.guaranteedAt', [guaranteedAt]) }}
          </v-list-item-subtitle>

          <template #append>
            <span class="text-h6 text-legendary font-weight-bold">
              <span>
                {{ guaranteedAt5 }}
              </span>
            </span>
          </template>
        </v-list-item>
      </v-alert>
      <v-progress-linear
        :model-value="guaranteedAt5"
        :max="guaranteedAt"
        class="mb-4 rounded-be-lg rounded-bs-lg bg-background"
      />

      <!-- 4 star pity -->
      <v-alert class="rounded-be-0 rounded-bs-0">
        <v-list-item class="pa-0">
          <v-list-item-title class="text-rarity4">
            4★ {{ $t('convene.pity') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.guaranteedAt', [10]) }}
          </v-list-item-subtitle>

          <template #append>
            <span class="text-h6 font-weight-bold">
              {{ guaranteedAt4 }}
            </span>
          </template>
        </v-list-item>
      </v-alert>
      <v-progress-linear
        :model-value="guaranteedAt4"
        :max="10"
        class="rounded-be-lg rounded-bs-lg bg-background"
      />
    </v-card-text>

    <div v-if="guaranteedAt5List.length > 0">
      <v-row>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="d-flex align-center justify-center">
          {{ $t('common.recent') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
      <v-card-actions class="d-flex flex-wrap ga-2 justify-center">
        <v-chip v-for="(element, index) in guaranteedAt5List" :key="index">
          <span>{{ $t(element.name) }}</span>
          <span
            class="ml-2 font-weight-bold"
            :style="`color: hsl(${100 - (element.pity / 80) * 100}, 100%, 50%);`"
          >
            {{ element.pity }}
          </span>
        </v-chip>
      </v-card-actions>
    </div>
  </v-card>
</template>
