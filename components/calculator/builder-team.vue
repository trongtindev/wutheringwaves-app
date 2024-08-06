<script setup lang="ts">
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
  <div>
    <v-row>
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

    <v-row>
      <v-col v-for="(item, index) in calculator.participants" :key="index">
        <calculator-builder-team-item :index :item :characters />
      </v-col>
    </v-row>
  </div>
</template>
