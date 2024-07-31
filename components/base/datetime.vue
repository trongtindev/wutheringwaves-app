<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// const model = defineModel<Dayjs>(dayjs());

// states
const date = ref<Dayjs>(dayjs());
const time = ref<Dayjs>(dayjs());

// changes
watch(
  () => date.value,
  (newValue) => {
    console.log('newValue', newValue);
  },
);
</script>

<template>
  {{ date }}
  {{ time }}
  <v-menu :close-on-content-click="false" :close-on-back="false">
    <template #activator="menu">
      <!-- <slot v-bind="menu.props" /> -->
      <v-btn v-bind="menu.props" text="OK" />
    </template>

    <v-card class="border">
      <v-row>
        <v-col>
          <v-date-picker v-model="date" />
        </v-col>

        <v-col>
          <v-time-picker v-model="time" class="pa-4" />
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>
