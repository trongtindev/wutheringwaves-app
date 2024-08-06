<script setup lang="ts">
import type { ICalculatorEcho } from '~/interfaces/calculator';

const props = defineProps<{
  item: ICalculatorEcho;
}>();
const format = formatNumber;

// uses
const resources = useResources();

// fetch
const sonataEffects = await resources.getSonataEffects();

// states
const level = ref(props.item.level);

// computed
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
</script>

<template>
  <div>
    <v-slider
      v-model="level"
      :min="1"
      :max="20"
      :label="$t('common.level')"
      :disabled="!item.item"
      thumb-label
      hide-details
    />

    <!-- stats -->
    <v-table class="border rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            <span v-if="item.item"> [{{ item.item.name }}] </span>
            <span v-else> [{{ $t('common.none') }}] </span>
            {{ $t('common.stats') }}
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

    <!-- sonata effects -->
  </div>
</template>
