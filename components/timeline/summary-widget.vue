<script setup lang="ts">
import dayjs from 'dayjs';
import type { IEvent } from '~/interfaces/event';

// define
const emits = defineEmits<{
  (e: 'on-done'): void;
}>();

// uses
const resources = useResources();

// states
const current = ref<IEvent[]>([]);
const upcoming = ref<IEvent[]>([]);

// functions
const initialize = () => {
  const now = dayjs();

  return new Promise((resolve, reject) => {
    resources
      .getEvents()
      .then((result) => {
        const list = (result.flatMap((e) => e) as IEvent[]).sort((a, b) => {
          const timeA = dayjs(a.time.start).toDate().getTime();
          const timeB = dayjs(b.time.start).toDate().getTime();
          return timeB - timeA;
        });

        current.value = list
          .filter((e) => {
            const timeStart = dayjs(e.time.start);
            const timeEnd = dayjs(e.time.end);
            return now > timeStart && now < timeEnd;
          })
          .sort((a, b) => {
            const timeA = dayjs(a.time.end).toDate().getTime();
            const timeB = dayjs(b.time.end).toDate().getTime();
            return timeA - timeB;
          })
          .splice(0, 3);

        upcoming.value = list
          .filter((e) => {
            const timeStart = dayjs(e.time.start);
            return timeStart > now;
          })
          .sort((a, b) => {
            const timeA = dayjs(a.time.start).toDate().getTime();
            const timeB = dayjs(b.time.start).toDate().getTime();
            return timeA - timeB;
          })
          .splice(0, 3);

        setTimeout(() => emits('on-done'), 50);
        resolve(true);
      })
      .catch(reject);
  });
};

await initialize();
</script>

<template>
  <v-list>
    <!-- current -->
    <v-list-subheader>
      {{ $t('timeline.current') }}
    </v-list-subheader>

    <v-list-item
      v-for="(element, index) in current"
      :key="index"
      class="rounded-xl"
      :class="{
        'mt-2': index > 0
      }"
    >
      <v-list-item-title>
        {{ element.name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <client-only>
          <template #fallback>...</template>
          {{ $t('timeline.endsIn', [dayjs(element.time.end).fromNow()]) }}
        </client-only>
      </v-list-item-subtitle>
    </v-list-item>

    <!-- upcoming -->
    <v-list-subheader>
      {{ $t('timeline.upcoming') }}
    </v-list-subheader>

    <v-list-item
      v-for="(element, index) in upcoming"
      :key="index"
      class="rounded-xl"
      :class="{
        'mt-2': index > 0
      }"
    >
      <v-list-item-title>
        {{ element.name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <client-only>
          <template #fallback>...</template>
          {{ $t('timeline.startsIn', [dayjs(element.time.start).fromNow()]) }}
        </client-only>
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>
