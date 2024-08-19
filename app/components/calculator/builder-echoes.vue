<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const echoes = await resource.getEchoes();
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('common.echoes') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div v-if="props.lite">
      <calculator-builder-echoes-item
        :index="calculator.participant"
        :item="calculator.participants[calculator.participant]"
        :echoes
      />
    </div>

    <div v-else>
      <v-row class="ga-4">
        <v-col v-for="(item, index) in calculator.participants" :key="index">
          <calculator-builder-echoes-item :index :item :echoes />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
