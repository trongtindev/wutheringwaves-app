<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import { CardPoolType } from '@/interfaces/banner';

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

// states
const convenes = ref<ConveneDocument[]>();
const guaranteedAt = ref(0);

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

const luckWinRateOff = computed(() => {
  const total = guaranteedAt5List.value.length;
  if (total == 0) return '~';
  const wins = guaranteedAt5List.value.filter((e) => e.win).length;
  return formatNumber((wins / total) * 100);
});

// functions
const initialize = async () => {
  const db = await database.getInstance();
  db.convenes
    .find({
      selector: {
        playerId: account.active,
        cardPoolType: props.type
      }
    })
    .sort({
      createdAt: 'desc'
    })
    .exec()
    .then((result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      convenes.value = result as any;
      guaranteedAt.value = 80;

      setTimeout(() => {
        emits('on-updated');
      }, 250);
    })
    .catch(console.warn);
};

// changes
watch(
  () => account.active,
  () => initialize()
);

// lifecycle
if (import.meta.client) {
  onMounted(() => initialize());
}
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

      <!-- luckWinRateOff -->
      <v-alert v-if="showLuckWinRateOff" class="mb-4">
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('convene.rank.luckWinRateOff') }}
          </v-list-item-title>

          <template #append>
            <span class="text-h6 text-legendary font-weight-bold">
              {{ luckWinRateOff }}%
            </span>
          </template>
        </v-list-item>
      </v-alert>

      <!-- 5 star pity -->
      <v-alert class="mb-4">
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('5 ★ Pity') }}
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

      <!-- 4 star pity -->
      <v-alert>
        <v-list-item class="pa-0">
          <v-list-item-title>
            {{ $t('4 ★ Pity') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.guaranteedAt', [10]) }}
          </v-list-item-subtitle>

          <template #append>
            <span class="text-h6 text-rare font-weight-bold">
              {{ guaranteedAt4 }}
            </span>
          </template>
        </v-list-item>
      </v-alert>
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
