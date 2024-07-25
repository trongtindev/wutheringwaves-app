<script setup lang="ts">
// import dayjs from 'dayjs';
import { mdiOpenInNew, mdiLink } from '@mdi/js';
import type { ITimelineEvent } from '~/interfaces/timeline';

// define
const props = defineProps<{
  data: ITimelineEvent;
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

    <!-- thumbnail -->
    <base-image
      v-if="props.data.thumbnail"
      :src="props.data.thumbnail"
      :aspect-ratio="16 / 9"
      :cover="true"
      class="border-t border-b"
    />
    <v-divider v-else />

    <v-card-text>
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

      <v-card
        v-if="props.data.officialUrl"
        :title="$t('timeline.checkoutOfficialUrl')"
        :subtitle="props.data.officialUrl"
        :append-icon="mdiOpenInNew"
        :href="props.data.officialUrl"
        class="mt-2"
        target="_blank"
        rel="nofollow"
      />
    </v-card-text>
    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
