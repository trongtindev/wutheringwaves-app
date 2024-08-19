<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const characters = await resource.getCharacters({
  hidden: false,
  upcoming: false,
});
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('common.team') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div v-if="props.lite">
      <calculator-builder-team-item
        :index="calculator.participant"
        :item="calculator.participants[calculator.participant]"
        :characters
      />
    </div>

    <div v-else>
      <v-row class="ga-4">
        <v-col v-for="(item, index) in calculator.participants" :key="index">
          <calculator-builder-team-item :index :item :characters />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
