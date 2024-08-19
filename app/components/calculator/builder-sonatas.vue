<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const sonatas = await resource.getSonataEffects();
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('common.sonataEffects') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div v-if="props.lite">
      <calculator-builder-sonatas-item
        :participant="calculator.participant"
        :item="calculator.participants[calculator.participant]"
        :sonatas
      />
    </div>

    <div v-else>
      <v-row class="ga-4">
        <v-col v-for="(item, index) in calculator.participants" :key="index">
          <calculator-builder-sonatas-item
            :participant="index"
            :item
            :sonatas
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
