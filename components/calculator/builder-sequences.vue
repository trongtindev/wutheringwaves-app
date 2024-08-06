<script setup lang="ts">
// uses
const calculator = useCalculator();

// states
const levels = ref<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0 });

const setLevel = (index: number, value: number) => {
  calculator.participants[index].characterSequences = value;
};
</script>

<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center">
        <v-divider />
      </v-col>
      <v-col class="text-h6 text-center">
        {{ $t('common.sequences') }}
      </v-col>
      <v-col class="d-flex align-center">
        <v-divider />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(element, index) in calculator.participants" :key="index">
        <v-slider
          v-model="levels[index]"
          :step="1"
          :min="0"
          :max="6"
          :label="$t('common.level')"
          :disabled="!element.character"
          thumb-label
          hide-details
          @update:model-value="(val) => setLevel(index, val)"
        >
          <template #label>
            <div style="width: 100px">
              {{ $t('common.level') }}
            </div>
          </template>
        </v-slider>

        <v-expansion-panels
          v-if="!element.character || !element.character.data.resonanceChain"
          class="mt-2"
        >
          <v-expansion-panel v-for="(item, j) in 6" :key="j" :disabled="true">
            <v-expansion-panel-title></v-expansion-panel-title>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels v-else class="mt-2">
          <calculator-builder-sequence-item
            v-for="(item, j) in element.character.data.resonanceChain"
            :key="j"
            :item
            :disabled="j >= element.characterSequences"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
