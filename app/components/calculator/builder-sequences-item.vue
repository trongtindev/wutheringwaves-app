<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
}>();

// uses
const calculator = useCalculator();

// states
const level = ref(props.item.characterSequences);

// changes
watch(level, (value) => {
  calculator.participants[props.index].characterSequences = value;
});
</script>

<template>
  <div>
    <v-slider
      v-model="level"
      :step="1"
      :min="0"
      :max="6"
      :label="$t('common.level')"
      :disabled="!item.character"
      thumb-label
      hide-details
    >
      <template #label>
        <div style="width: 100px">
          {{ $t('common.level') }}
        </div>
      </template>
    </v-slider>

    <v-expansion-panels
      v-if="!item.character || !item.character.data.resonanceChain"
      class="mt-2"
    >
      <v-expansion-panel v-for="(item, j) in 6" :key="j" :disabled="true">
        <v-expansion-panel-title></v-expansion-panel-title>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels v-else class="mt-2">
      <calculator-builder-sequence-item
        v-for="(item, j) in item.character.data.resonanceChain"
        :key="j"
        :item
        :disabled="j >= props.item.characterSequences"
      />
    </v-expansion-panels>
  </div>
</template>
