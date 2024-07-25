<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// late
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let interval: any;

// define
const props = defineProps<{
  title?: string;
  utcOffset?: number;
}>();

// states
const time = ref<Dayjs>();
const timeName = ref();
const offset = ref<number>();

// functions
const initialize = () => {
  timeName.value = props.title || dayjs.tz.guess();

  if (typeof props.utcOffset !== 'undefined') {
    offset.value = props.utcOffset;
  }

  if (interval) clearInterval(interval);
  interval = setInterval(update, 1000);
};

const update = () => {
  if (typeof offset.value === 'undefined') {
    time.value = dayjs();
  } else {
    time.value = dayjs().utcOffset(offset.value);
  }
};

// lifecycle
onMounted(initialize);
onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <v-card class="fill-height">
    <v-card-title class="text-center">
      <client-only>
        <template #fallback>
          {{ $t('common.loading') }}
        </template>
        <span v-if="timeName">
          {{ timeName }}
        </span>
      </client-only>
    </v-card-title>
    <v-divider />

    <v-card-text class="text-center">
      <client-only>
        <template #fallback>
          <div>
            <div class="text-body-1">0000/00/00</div>
            <div class="text-body-1">00:00:00</div>
          </div>
        </template>

        <div>
          <div>
            <span v-if="time" class="text-body-1">
              {{ time.format('YYYY/MM/DD') }}
            </span>

            <span v-else class="text-body-1">0000/00/00</span>
          </div>

          <div>
            <span v-if="time" class="text-body-1">
              {{ time.format('HH:mm:ss') }}
            </span>

            <span v-else class="text-body-1">00:00:00</span>
          </div>
        </div>
      </client-only>
    </v-card-text>
  </v-card>
</template>
