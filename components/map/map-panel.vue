<script setup lang="ts">
import { mdiMapMarker, mdiComment, mdiAccount } from '@mdi/js';

// states
const tab = ref();
</script>

<template>
  <v-tabs v-model="tab" :fixed-tabs="true">
    <v-tab value="markers">
      <v-icon :icon="mdiMapMarker" />
    </v-tab>
    <v-tab value="comments">
      <v-icon :icon="mdiComment" />
    </v-tab>
    <v-tab value="account">
      <v-icon :icon="mdiAccount" />
    </v-tab>
  </v-tabs>
</template>
