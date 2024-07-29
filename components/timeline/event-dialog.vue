<script setup lang="ts">
import dayjs from 'dayjs';
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
const startsIn = computed(() => {
  return props.data.start.diff(dayjs(), 'minutes');
});

const endsIn = computed(() => {
  return props.data.end.diff(dayjs(), 'minutes');
});

const nameLocalized = computed(() => {
  return props.data.name;
});

const descriptionLocalized = computed(() => {
  return props.data.description;
});
</script>

<template>
  <v-card>
    <!-- thumbnail -->
    <base-image
      v-if="props.data.thumbnail"
      :src="props.data.thumbnail"
      :aspect-ratio="16 / 9"
      :cover="true"
    />

    <v-card-title>
      {{ nameLocalized }}
    </v-card-title>

    <v-card-text>
      <!-- description -->
      <div>
        <div
          v-if="descriptionLocalized"
          :innerHTML="descriptionLocalized"
        ></div>
        <div v-else>
          {{ $t('common.noDescription') }}
        </div>
      </div>

      <!-- time -->
      <div class="mt-2">
        <v-chip
          v-if="startsIn > 0"
          :text="$t('timeline.startsIn', [props.data.start.fromNow()])"
          color="success"
        />

        <v-chip
          v-else-if="endsIn > 0"
          :text="$t('timeline.endsIn', [props.data.end.fromNow()])"
          color="info"
        />

        <v-chip v-else :text="$t('timeline.ended')" />
      </div>

      <v-card
        v-if="props.data.officialUrl"
        :title="$t('timeline.checkoutOfficialUrl')"
        :subtitle="props.data.officialUrl"
        :append-icon="mdiOpenInNew"
        :href="props.data.officialUrl"
        class="mt-4 border"
        target="_blank"
        rel="nofollow"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
