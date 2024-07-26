<script setup lang="ts">
import dayjs from 'dayjs';
import type { ITimeline, ITimelineEvent } from '~/interfaces/timeline';

// define
const dayWidth = 40;
const eventHeight = 36;
const EVENT_MARGIN = 8;
const padding = 10;
const marginTop = 80;
const MONTH_HEIGHT = 48;

// uses
const i18n = useI18n();
const resources = useResources();

// fetch
const timeline = await resources.getTimeline();

// states
const timeDifference = ref(0);
const lastEventTime = ref(dayjs().year(2000));
const events = ref<any>([]);
const interval = ref();
const today = ref(dayjs());
const firstDay = ref(dayjs());
const dates = ref();
const months = ref<
  {
    [key: string]: {
      offset: number;
      total: number;
    };
  }[]
>([]);
const monthList = ref();
const todayOffset = ref(0);
const timelineContainer = ref<HTMLElement>(null as any);
const dialog = ref(false);
const dialogData = ref<ITimelineEvent>();
const browserTimeZone = ref();

// functions
const convertToDate = (e: ITimeline, i: number): ITimelineEvent => {
  const start = dayjs(e.time.start, 'YYYY-MM-DD HH:mm').subtract(
    timeDifference.value,
    'minute'
  );
  const end = dayjs(e.time.end, 'YYYY-MM-DD HH:mm').subtract(
    timeDifference.value,
    'minute'
  );
  const duration = end.diff(start, 'day', true);
  if (lastEventTime.value < end) lastEventTime.value = end;

  return {
    ...e,
    index: i,
    start,
    end,
    duration
  };
};

// events
const onTick = () => {
  today.value = dayjs().subtract(timeDifference.value, 'minute');
  todayOffset.value = Math.abs(firstDay.value.diff(today.value, 'day', true));
};

const onPressedEvent = (data: ITimelineEvent) => {
  dialog.value = true;
  dialogData.value = data;
};

const onWheel = (event: WheelEvent) => {
  if (!event.deltaY) {
    return;
  }

  const delta = Math.abs(event.deltaY);
  const dir = event.deltaY > 0 ? 1 : -1;

  if (event.currentTarget) {
    (event.currentTarget as any).scrollLeft +=
      Math.max(delta, 100) * dir + event.deltaX;
    event.preventDefault();
  }
};

watch(
  () => timelineContainer.value,
  () => {
    const left =
      todayOffset.value * dayWidth -
      timelineContainer.value.offsetWidth / 2 +
      dayWidth;
    timelineContainer.value.scrollTo({
      left,
      top: 0,
      behavior: 'smooth'
    });
  }
);

// lifecycle
onMounted(() => {
  browserTimeZone.value = dayjs.tz.guess();
  timeDifference.value = getTimeDifference();

  events.value = timeline.map((e, i) => {
    if (Array.isArray(e)) {
      return e.map((item) => convertToDate(item, i));
    }
    return convertToDate(e, i);
  });

  events.value
    .slice()
    .sort((a, b) => {
      if (Array.isArray(a) && Array.isArray(b)) {
        return a[0].start - b[0].start;
      } else if (!Array.isArray(a) && Array.isArray(b)) {
        return a.start - b[0].start;
      } else if (Array.isArray(a) && !Array.isArray(b)) {
        return a[0].start - b.start;
      } else {
        return a.start - b.start;
      }
    })
    .forEach((e, i) => {
      if (i === 0) {
        if (Array.isArray(e)) {
          firstDay.value = e[0].start
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
            .subtract(padding, 'day');
        } else {
          firstDay.value = e.start
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
            .subtract(padding, 'day');
        }
      }

      if (Array.isArray(e)) {
        for (let j = 0; j < e.length; j++) {
          const current = e[j];

          const offset = Math.abs(
            firstDay.value.diff(
              events.value[current.index][j].start,
              'day',
              true
            )
          );
          events.value[current.index][j].offset = offset;
        }
      } else {
        const offset = Math.abs(firstDay.value.diff(e.start, 'day', true));
        events.value[e.index].offset = offset;
      }
    });

  const dayTotal =
    Math.abs(Math.ceil(firstDay.value.diff(lastEventTime.value, 'day', true))) +
    2 * padding;

  months.value = [];
  for (let i = 0; i < dayTotal; i++) {
    const month = firstDay.value.add(i, 'day').format('MMMM');
    if (months.value[month] === undefined) {
      months.value[month] = {
        total: 0,
        offset: 0
      };
    }
    months.value[month].total++;
  }

  monthList.value = Object.entries(months.value);
  for (let i = 0; i < monthList.value.length; i++) {
    monthList.value[i][1].offset =
      i - 1 >= 0
        ? monthList.value[i - 1][1].total + monthList.value[i - 1][1].offset
        : 0;
  }

  dates.value = [...new Array(dayTotal)].map((_, i) => {
    const cur = firstDay.value.add(i, 'day');
    return [cur.date(), cur.format('dd')];
  });

  interval.value = setInterval(onTick, 1000);
  todayOffset.value = Math.abs(firstDay.value.diff(today.value, 'day', true));
});

onUnmounted(() => {
  clearInterval(interval.value);
});

// seo meta
const title = i18n.t('meta.timeline.title');
const description = i18n.t('meta.timeline.description');

useApp().title = i18n.t('timeline.title');
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <!-- chips -->
  <header-chips class="mb-2" :github="`tree/main/resources/timeline.json`" />

  <v-card>
    <!-- TODO: [WARN] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952 -->
    <client-only>
      <div
        ref="timelineContainer"
        class="w-100 overflow-x-scroll overflow-y-hidden"
        style="width: min-content"
        :style="`padding-right: ${2 * padding * dayWidth}px; height: ${marginTop + 48 + events.length * (eventHeight + EVENT_MARGIN)}px`"
        :onwheel="onWheel"
      >
        <div class="timeline position-relative h-100 d-flex flex-column">
          <!-- MONTH TITLE -->
          <v-sheet
            v-for="([month, item], i) in monthList"
            :key="i"
            :style="`width: ${item.total * dayWidth}px; left: ${item.offset * dayWidth}px;`"
            :height="MONTH_HEIGHT"
            class="position-absolute pr-4 top-0 d-flex align-center"
          >
            <span class="text-h6 position-sticky left-0">
              {{ month }}
            </span>
          </v-sheet>

          <!-- DATE BAR -->
          <div
            v-for="(date, i) in dates"
            :key="i"
            :style="`height: calc(100% - ${MONTH_HEIGHT}px); left: ${i * dayWidth}px; top: ${MONTH_HEIGHT + 24}px;`"
            class="bg-border position-absolute w-1"
          >
            <span
              class="position-absolute text-center pb-1"
              style="width: 40px; left: -20px; top: -24px"
            >
              {{ date[0] }}
            </span>
            <span
              class="position-absolute text-caption text-center pb-1 top-0"
              style="width: 40px; left: -20px"
            >
              {{ date[1] }}
            </span>
          </div>

          <!-- EVENT STRIP -->
          <div v-for="(event, i) in events" :key="i">
            <timeline-event-item
              v-for="(item, j) in event"
              :key="j"
              :prev="j > 0 ? event[j - 1] : null"
              :next="j < event.length - 1 ? event[j + 1] : null"
              :now="today"
              :event="item"
              :day-width="dayWidth"
              :margin-top="marginTop + 24"
              :event-height="eventHeight"
              :event-margin="EVENT_MARGIN"
              :i="i"
              @on-pressed="() => onPressedEvent(item)"
            />
          </div>

          <!-- NOW BAR -->
          <div
            class="now-bar w-2 position-relative opacity-75"
            :style="`left: ${todayOffset * dayWidth}px; top: 12.6px`"
          >
            <div
              class="position-absolute rounded-xl text-center bg-surface border"
              style="width: 80px; left: -40px"
            >
              {{ today.format('HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </v-card>

  <v-dialog v-model="dialog" :width="720" :scrollable="true">
    <timeline-event-dialog
      v-if="dialogData"
      :data="dialogData"
      @on-close="() => (dialog = false)"
    />
  </v-dialog>
</template>

