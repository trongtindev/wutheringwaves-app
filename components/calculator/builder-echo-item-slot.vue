<script setup lang="ts">
import type { ICalculatorEcho } from '~/interfaces/calculator';
import { mdiPencil } from '@mdi/js';

const props = defineProps<{
  participant: number;
  item: ICalculatorEcho;
  index: number;
}>();
const format = formatNumber;

// uses
const resources = useResources();
const calculator = useCalculator();

// fetch
const sonataEffects = await resources.getSonataEffects();

// states
const level = ref(props.item.level);
const rarity = ref(props.item.rarity);

// computed
const mainstats = computed(() => {
  return undefined;
});

const substats = computed(() => {
  return undefined;
});

const stats = computed(() => {
  return [
    {
      label: 'critRate',
      value: 5,
    },
    {
      label: 'critDMG',
      value: 150,
    },
  ];
});

// functions
const loadStats = () => {
  level.value = props.item.level;
  rarity.value = props.item.rarity;
};

const setMinStats = () => {};

const setMaxStats = () => {};

const setRandomStats = () => {};

// changes
watch(() => props.index, loadStats);

watch(level, (value) => {
  calculator.participants[props.participant].echoes[props.index].level = value;
});

watch(rarity, (value) => {
  calculator.participants[props.participant].echoes[props.index].rarity = value;
});
</script>

<template>
  <div>
    <!-- level -->
    <v-slider
      v-model="level"
      :min="1"
      :max="20"
      :step="1"
      :label="$t('common.level')"
      :disabled="!item.item"
      thumb-label
      hide-details
    />

    <!-- rarity -->
    <v-slider
      v-model="rarity"
      :min="2"
      :max="5"
      :step="1"
      :label="$t('common.rarity')"
      :disabled="!item.item"
      thumb-label
      hide-details
    />

    <!-- main stats -->
    <v-table class="rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            <span v-if="item.item"> [{{ item.item.name }}] </span>
            <span v-else> [{{ $t('common.none') }}] </span>
            {{ $t('common.mainstats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="w-50 text-center">
            <v-btn :text="$t('common.select')" :append-icon="mdiPencil" />
          </td>
          <td class="w-50 text-center">
            {{ $t('common.none') }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- sub stats -->
    <v-table class="rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            <span v-if="item.item"> [{{ item.item.name }}] </span>
            <span v-else> [{{ $t('common.none') }}] </span>
            {{ $t('common.substats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(element, j) in stats" :key="j">
          <td class="w-50 text-center">
            {{ $t(`common.${element.label}`) }}
          </td>
          <td class="w-50 text-center">
            {{ format(element.value) }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- generate -->
    <div class="mt-2">
      <v-row>
        <v-col>
          <v-btn :text="$t('common.min')" block @click="setMinStats" />
        </v-col>
        <v-col>
          <v-btn :text="$t('common.max')" block @click="setMaxStats" />
        </v-col>
        <v-col>
          <v-btn :text="$t('common.random')" block @click="setRandomStats" />
        </v-col>
      </v-row>
    </div>

    <!-- sonata effects -->
  </div>
</template>
