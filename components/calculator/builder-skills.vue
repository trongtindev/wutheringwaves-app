<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const calculator = useCalculator();
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('common.skills') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div v-if="props.lite">
      <calculator-builder-skills-item
        :participant="calculator.participant"
        :item="calculator.participants[calculator.participant]"
      />
    </div>

    <div v-else>
      <v-row class="ga-4">
        <v-col
          v-for="(item, participant) in calculator.participants"
          :key="participant"
        >
          <calculator-builder-skills-item :participant :item />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
