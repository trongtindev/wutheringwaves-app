<script setup lang="ts">
import { mdiChevronRight } from '@mdi/js';
import moment from 'moment';
import type { ITimeline } from '~/interfaces/timeline';

// define
const emits = defineEmits<{
  (e: 'on-done'): void;
}>();

// uses
const resources = useResources();
const localePath = useLocalePath();

// states
const current = ref<ITimeline[]>([]);
const upcoming = ref<ITimeline[]>([]);

// functions
const initialize = () => {
  const now = moment();

  return new Promise((resolve, reject) => {
    resources
      .getTimeline()
      .then((result) => {
        const list = (result.flatMap((e) => e) as ITimeline[]).sort((a, b) => {
          const timeA = moment(a.time.start).toDate().getTime();
          const timeB = moment(b.time.start).toDate().getTime();
          return timeB - timeA;
        });

        current.value = list
          .filter((e) => {
            const timeStart = moment(e.time.start);
            const timeEnd = moment(e.time.end);
            return now > timeStart && now < timeEnd;
          })
          .sort((a, b) => {
            const timeA = moment(a.time.end).toDate().getTime();
            const timeB = moment(b.time.end).toDate().getTime();
            return timeA - timeB;
          })
          .splice(0, 3);

        upcoming.value = list
          .filter((e) => {
            const timeStart = moment(e.time.start);
            return timeStart > now;
          })
          .sort((a, b) => {
            const timeA = moment(a.time.start).toDate().getTime();
            const timeB = moment(b.time.start).toDate().getTime();
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
  <v-card>
    <v-card-title>
      {{ $t('timeline.summary') }}
    </v-card-title>

    <v-list>
      <!-- current -->
      <v-list-subheader v-if="current.length > 0">
        {{ $t('timeline.current') }}
      </v-list-subheader>

      <v-list-item
        v-for="(element, index) in current"
        :key="index"
        class="rounded-xl"
        :class="{
          'mt-2': index > 0,
        }"
      >
        <v-list-item-title>
          {{ element.name }}
        </v-list-item-title>

        <v-list-item-subtitle>
          <client-only>
            <template #fallback>...</template>
            {{ $t('timeline.endsIn', [moment(element.time.end).fromNow()]) }}
          </client-only>
        </v-list-item-subtitle>
      </v-list-item>

      <!-- upcoming -->
      <v-list-subheader v-if="upcoming.length > 0">
        {{ $t('timeline.upcoming') }}
      </v-list-subheader>

      <v-list-item
        v-for="(element, index) in upcoming"
        :key="index"
        class="rounded-xl"
        :class="{
          'mt-2': index > 0,
        }"
      >
        <v-list-item-title>
          {{ element.name }}
        </v-list-item-title>

        <v-list-item-subtitle>
          <client-only>
            <template #fallback>...</template>
            {{
              $t('timeline.startsIn', [moment(element.time.start).fromNow()])
            }}
          </client-only>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-card-actions class="d-flex justify-end">
      <v-card-btn
        :to="localePath('/timeline')"
        :text="$t('timeline.title')"
        :append-icon="mdiChevronRight"
      />
    </v-card-actions>
  </v-card>
</template>
