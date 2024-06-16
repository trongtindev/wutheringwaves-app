<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import type { CardPoolType } from '@/interfaces/banner';

// uses
const i18n = useI18n();
const account = useAccount();
const database = useDatabase();

const props = defineProps<{
  title: string;
  type: CardPoolType;
}>();

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

  const items: {
    name: string;
    pity: number;
    // TODO: check win-rate
    win?: boolean;
  }[] = [];

  for (let i = 0; i < convenes.value.length; i += 1) {
    const element = convenes.value[i];
    if (element.qualityLevel < 5) {
      if (items.length > 0) {
        items[items.length - 1].pity += 1;
      }
      continue;
    }

    items.push({
      name: element.name,
      pity: 1
    });
  }

  return items;
});

// functions
const initialize = () => {
  if (!database.isInitialized) {
    setTimeout(() => initialize(), 250);
    return;
  }

  database
    .getInstance()
    .convenes.find({
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
      // TODO: fixme
      convenes.value = result as any;
      guaranteedAt.value = 80;
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
  <v-card>
    <v-card-title>
      {{ props.title }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2">
        <v-list-item>
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
      </v-sheet>

      <v-sheet class="bg-blue-grey-darken-3 rounded mt-4 pt-2 pb-2">
        <v-list-item>
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
      </v-sheet>

      <v-sheet class="bg-blue-grey-darken-3 rounded mt-4 pt-2 pb-2">
        <v-list-item>
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
      </v-sheet>
    </v-card-text>

    <v-divider v-if="guaranteedAt5List.length > 0" />
    <v-card-text v-if="guaranteedAt5List.length > 0">
      <v-chip
        v-for="(element, index) in guaranteedAt5List"
        :key="index"
        :color="element.win ? 'success' : undefined"
        :class="index > 0 ? `ml-2` : ``"
      >
        <span>{{ $t(element.name) }}</span>
        <span
          class="ml-2 font-weight-bold"
          :style="`color: hsl(${100 - (element.pity / 80) * 100}, 100%, 50%);`"
        >
          {{ element.pity }}
        </span>
      </v-chip>
    </v-card-text>
  </v-card>
</template>
