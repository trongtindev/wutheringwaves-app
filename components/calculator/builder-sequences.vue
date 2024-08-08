<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const calculator = useCalculator();
</script>

<template>
  <div id="builder-sequences" data-tour="true" class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
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
    </div>

    <div v-if="props.lite">
      <calculator-builder-sequences-item
        :index="calculator.participant"
        :item="calculator.participants[calculator.participant]"
      />
    </div>

    <div v-else>
      <v-row class="ga-4">
        <v-col v-for="(item, index) in calculator.participants" :key="index">
          <calculator-builder-sequences-item :index="index" :item="item" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
