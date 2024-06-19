<script setup lang="ts">
const backup = useBackup();

// computed
const overlay = computed(() => backup.state == 'restore');
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
