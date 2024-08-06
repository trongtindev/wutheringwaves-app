<script setup lang="ts">
// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const echoes = await resource.getEchoes();
</script>

<template>
  <div>
    <v-row>
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

    <v-row>
      <v-col
        v-for="(item, index) in calculator.participants"
        :key="index"
      >
        <calculator-builder-echo-item
          :index
          :item
          :echoes
        />
      </v-col>
    </v-row>
  </div>
</template>
