<script setup lang="ts">
// uses
const resource = useResources();
const calculator = useCalculator();
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('calculator.builder.rotation.title') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <!-- <v-row> </v-row> -->
  </div>
</template>
