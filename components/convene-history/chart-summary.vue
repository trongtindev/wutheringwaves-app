<script setup lang="ts">
import dayjs from 'dayjs';
import { Bar } from 'vue-chartjs';
import type { ConveneDocumentConverted } from '~/interfaces/convene';

const props = defineProps<{
  convenes?: ConveneDocumentConverted[] | undefined;
}>();
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const i18n = useI18n();

// states
const chartInitialized = ref();
const items = ref<ConveneDocumentConverted[]>(props.convenes || []);

// computed
const range = computed(() => {
  return Array.from(Array(14).keys()).map((i) => {
    return dayjs().subtract(13 - i, 'day');
  });
});

const labels = computed(() => {
  const format = i18n.locale.value === 'vi' ? 'DD/MM' : 'MM/DD';
  return range.value.map((e) => {
    return e.format(format);
  });
});

const datasets = computed(() => {
  return range.value.map((e) => {
    return items.value.filter((convene) => {
      const conveneTime = dayjs(convene.time);
      return (
        conveneTime.day() == e.day() &&
        conveneTime.date() == e.date() &&
        conveneTime.year() == e.year()
      );
    }).length;
  });
});

// changes
watch(
  () => props.convenes,
  (value) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.value = (value || []) as any;
    emits('on-updated');
  }
);

// lifecycle
onNuxtReady(async () => {
  const {
    Chart: ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } = await import('chart.js');

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  chartInitialized.value = true;
  setTimeout(() => emits('on-updated'), 500);
});
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('common.pullByDay') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <bar
        v-if="chartInitialized"
        :options="{
          responsive: true
        }"
        :data="{
          labels,
          datasets: [
            {
              data: datasets,
              label: $t('common.totalPull'),
              backgroundColor: 'green'
            }
          ]
        }"
      />
    </v-card-text>
  </v-card>
</template>
