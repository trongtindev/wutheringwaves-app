<script setup lang="ts">
import type { IEvent } from '~/interfaces/event';
// import dayjs from 'dayjs';

// define
const props = defineProps<{
  data: IEvent;
}>();

const emits = defineEmits<{
  (e: 'on-close'): void;
}>();

// computed
const nameLocalized = computed(() => {
  return props.data.name;
});

const descriptionLocalized = computed(() => {
  return props.data.description;
});
</script>

<template>
  <v-card>
    <v-card-title>
      {{ nameLocalized }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <!-- thumbnail -->
      <div v-if="props.data.thumbnail">
        <v-img
          :src="props.data.thumbnail"
          :aspect-ratio="16 / 9"
          class="border rounded"
          :cover="true"
        />
      </div>

      <!-- description -->
      <div v-if="descriptionLocalized">
        {{ descriptionLocalized }}
      </div>

      <!-- time -->
      <div class="d-flex flex-wrap ga-2">
        <span>
          {{ props.data.time.start }}
        </span>
        <span>-</span>
        <span>
          {{ props.data.time.end }}
        </span>
      </div>

      <!-- url -->
      <div v-if="props.data.url">
        <a
          :href="props.data.url"
          :title="props.data.url"
          target="_blank"
          rel="nofollow"
        >
          {{ props.data.url }}
        </a>
      </div>
    </v-card-text>
    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
