<script setup lang="ts">
import type { IEvent } from '~/interfaces/event';
import { mdiClose } from '@mdi/js';
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
      <v-row>
        <v-col class="d-flex align-center">
          {{ nameLocalized }}
        </v-col>

        <v-col class="d-flex align-center justify-end">
          <v-btn
            variant="text"
            size="x-small"
            :icon="mdiClose"
            @click="() => emits('on-close')"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />

    <v-card-text>
      <!-- thumbnail -->
      <div v-if="props.data.thumbnail" class="mb-2">
        <v-img :src="props.data.thumbnail" class="border rounded" />
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
  </v-card>
</template>
