<script setup lang="ts">
// Converted from https://github.com/MadeBaruna/paimon-moe/tree/main/src/routes/timeline
import dayjs from 'dayjs';
import type { IEvent, IEventConverted } from '~/interfaces/event';

// define
const dayWidth = 40;
const eventHeight = 36;
const eventMargin = 20;
const padding = 10;
const marginTop = 80;

// uses
const i18n = useI18n();
const resources = useResources();

// fetch
const eventsData = await resources.getEvents();

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
const dialogData = ref<IEvent>();
const browserTimeZone = ref();

// functions
const convertToDate = (e: IEvent, i): IEventConverted => {
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
  } as IEventConverted;
};

// events
const onTick = () => {
  today.value = dayjs().subtract(timeDifference.value, 'minute');
  todayOffset.value = Math.abs(firstDay.value.diff(today.value, 'day', true));
};

const onPressedEvent = (data: IEvent) => {
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

  events.value = eventsData.map((e, i) => {
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
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/timeline',
          title: i18n.t('timeline.title')
        }
      ]"
    />

    <v-card>
      <!-- TODO: [WARN] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952 -->
      <client-only>
        <div
          ref="timelineContainer"
          class="w-100 overflow-x-scroll"
          style="width: min-content"
          :style="`padding-right: ${2 * padding * dayWidth}px; height: ${marginTop + events.length * (eventHeight + eventMargin)}px`"
          :onwheel="onWheel"
        >
          <div
            class="timeline position-relative w-100 h-100 d-flex flex-column"
          >
            <!-- DATE BAR -->
            <div
              v-for="(date, i) in dates"
              :key="i"
              :style="`width: 1px; height: calc(100% - ${eventHeight}px); position: absolute; left: ${i * dayWidth}px; top: ${eventHeight}px;`"
              class="bg-grey-darken-3"
            >
              <span
                class="position-absolute text-center pb-1"
                style="width: 40px; left: -20px"
              >
                {{ date[0] }}
              </span>
              <span
                class="position-absolute text-grey-darken-1 text-center pb-1"
                style="width: 40px; left: -20px; top: -24px"
              >
                {{ date[1] }}
              </span>
            </div>

            <!-- MONTH TITLE -->
            <div
              v-for="([month, item], i) in monthList"
              :key="i"
              class="position-absolute pr-4"
              :style="`top: 12px; width: ${item.total * dayWidth}px; left: ${item.offset * dayWidth}px;`"
            >
              <span
                class="text-orange font-weight-bold position-sticky left-0 month"
              >
                {{ month }}
              </span>
            </div>

            <!-- EVENT STRIP -->
            <div v-for="(event, i) in events" :key="i">
              <div v-if="Array.isArray(event)">
                <timeline-event-item
                  v-for="(item, j) in event"
                  :key="j"
                  :prev="j > 0 ? event[j - 1] : null"
                  :next="j < event.length - 1 ? event[j + 1] : null"
                  :now="today"
                  :event="item"
                  :day-width="dayWidth"
                  :margin-top="marginTop"
                  :event-height="eventHeight"
                  :event-margin="eventMargin"
                  :i="i"
                  @on-pressed="() => onPressedEvent(item)"
                />
              </div>

              <timeline-event-item
                v-else
                :now="today"
                :event="event"
                :day-width="dayWidth"
                :margin-top="marginTop"
                :event-height="eventHeight"
                :event-margin="eventMargin"
                :i="i"
                @on-pressed="() => onPressedEvent(event)"
              />
            </div>

            <!-- NOW BAR -->
            <div
              class="bg-grey-darken-1 z-20 position-relative opacity-75"
              :style="`left: ${todayOffset * dayWidth}px; width: 2px; height: calc(100% - 10px); position: absolute; top: 10px;`"
            >
              <div
                class="position-absolute rounded-xl top-0 text-center bg-white text-black"
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
      <timeline-dialog
        v-if="dialogData"
        :data="dialogData"
        @on-close="() => (dialog = false)"
      />
    </v-dialog>
  </div>
</template>
