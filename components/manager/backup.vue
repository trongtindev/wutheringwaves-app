<script setup lang="ts">
const sync = useSync();

// computed
const overlay = computed(() => sync.state == 'restore');
</script>

<template>
  <v-overlay
    v-model="overlay"
    :persistent="true"
    class="d-flex align-center justify-center"
  >
    <v-progress-circular :indeterminate="true" />
  </v-overlay>
</template>
