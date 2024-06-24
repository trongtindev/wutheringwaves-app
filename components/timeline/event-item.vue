<script setup lang="ts">
import dayjs from 'dayjs';

// define
const props = defineProps<{
  i: number;
  prev?: any;
  next?: any;
  now: dayjs.Dayjs;
  event: any;
  dayWidth: number;
  marginTop: number;
  eventHeight: number;
  eventMargin: number;
}>();

const emits = defineEmits<{
  (e: 'on-pressed'): void;
}>();

// events
const onPressed = () => emits('on-pressed');

// computed
const prevDiff = computed(() => {
  return props.prev
    ? props.event.start.diff(props.prev.end, 'hour')
    : Number.MAX_VALUE;
});

const nextDiff = computed(() => {
  return props.next
    ? props.next.start.diff(props.event.end, 'hour')
    : Number.MAX_VALUE;
});

const prevNearby = computed(() => {
  return props.prev && prevDiff.value < 48;
});

const nextNearby = computed(() => {
  return props.next && nextDiff.value < 48;
});

const started = computed(() => {
  return props.now.isAfter(props.event.start);
});

const ended = computed(() => {
  return props.now.isAfter(props.event.end);
});

const attachedNext = computed(() => {
  return props.next && props.next.start.diff(props.event.end, 'hour') < 3;
});

const attachedPrev = computed(() => {
  return props.prev && props.event.start.diff(props.prev.end, 'hour') < 3;
});

const prevEnded = computed(() => {
  return props.prev && props.now.isAfter(props.prev.end);
});

const diffStart = computed(() => {
  return props.event.start.diff(props.now);
});

const diffEnd = computed(() => {
  return props.event.end.diff(props.now);
});

const shouldShowHourStart = computed(() => {
  return (
    diffStart.value <= 86400000 ||
    props.event.duration > 6.5 ||
    !prevNearby.value
  );
});

const shouldShowHourEnd = computed(() => {
  return (
    diffEnd.value <= 86400000 || props.event.duration > 6.5 || !prevNearby.value
  );
});

const style = computed(() => {
  let content = `width: ${props.dayWidth * props.event.duration}px;`;
  content += `left: ${props.dayWidth * props.event.offset}px;`;
  content += `background-color: ${props.event.color || 'orange'};`;
  content += `top: ${props.marginTop + props.i * (props.eventHeight + props.eventMargin)}px;`;
  content += `height: ${props.eventHeight}px;`;
  content += `padding-right: 10px;`;

  if (
    prevNearby.value &&
    !started.value &&
    (attachedPrev.value || prevEnded.value) &&
    prevNearby.value
  ) {
    content += `padding-left: 35px;`;
  } else {
    content += `padding-left: 10px;`;
  }

  return content;
});

const itemStyle = computed(() => {
  const contents = ['background-position: center;', 'background-size: cover;'];
  if (props.event.thumbnail) {
    contents.push(`background-image: url(${props.event.thumbnail});`);
  }
  return contents.join(' ');
});
</script>

<template>
  <div
    class="d-flex align-center justify-center z-10 text-white cursor-pointer position-absolute rounded-xl"
    :style="style"
    @click="() => onPressed()"
  >
    <div
      class="event-item"
      :style="itemStyle"
      :class="nextDiff < 1 ? '' : 'rounded-xl'"
    />
    <span
      class="event-name text position-sticky left-0 text-no-wrap overflow-hidden"
    >
      {{ event.name }}
    </span>

    <!-- Ending timer-->
    <div
      v-if="started && !ended && !props.event.startOnly && !attachedNext"
      class="position-absolute pl-3"
      style="top: 6px"
      :style="`right: ${nextNearby ? '-55px' : shouldShowHourEnd ? '-120px' : '-40px'}; width: ${shouldShowHourEnd ? '120px' : '40px'};`"
    >
      <span class="rounded-xl text-black bg-white bg-opacity-75 px-1">
        {{
          diffEnd > 86400000
            ? `${Math.trunc(dayjs.duration(diffEnd).asDays())}d
        ${shouldShowHourEnd ? dayjs.duration(diffEnd).format('H[h]') : ''}`
            : dayjs.duration(diffEnd).format('HH:mm:ss')
        }}
      </span>
    </div>

    <!-- Starting timer-->
    <div
      v-else-if="
        (prevNearby && !attachedPrev ? prevEnded : true) && !started && !ended
      "
      class="position-absolute pr-3 text-right"
      style="top: 6px"
      :style="`left: ${prevNearby ? (shouldShowHourStart ? '-80px' : '-18px') : '-120px'}; width: ${shouldShowHourStart ? '120px' : '40px'};`"
    >
      <span class="text-sm rounded-xl bg-white bg-opacity-75 px-1">
        {{
          diffStart > 86400000
            ? `${Math.trunc(dayjs.duration(diffStart).asDays())}d ${
                shouldShowHourStart
                  ? dayjs.duration(diffStart).format('H[h]')
                  : ''
              }`
            : dayjs.duration(diffStart).format('HH:mm:ss')
        }}
      </span>
    </div>
  </div>
</template>

<style>
div.event-item {
  position: absolute;
  opacity: 1;
  right: 0;
  top: 0;
  width: 100%;
  max-width: 200px;
  height: 100%;
  background-repeat: no-repeat;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>
