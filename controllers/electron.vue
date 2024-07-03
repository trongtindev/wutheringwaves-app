<script setup lang="ts">
const electron = useElectron();

// computed
const isStarting = computed(() => {
  return electron.enabled && electron.state === 'starting';
});
</script>

<template>
  <div>
    <v-overlay
      v-model="isStarting"
      :persistent="true"
      class="w-100 h-100 d-flex align-center justify-center"
    >
      <v-sheet class="border rounded pa-4">
        <v-progress-circular :indeterminate="true" />
      </v-sheet>
    </v-overlay>
  </div>
</template>
