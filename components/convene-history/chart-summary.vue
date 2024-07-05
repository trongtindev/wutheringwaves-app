<script setup lang="ts">
import dayjs from 'dayjs';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import type { ConveneDocumentConverted } from '~/interfaces/convene';
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  convenes?: ConveneDocumentConverted[] | undefined;
}>();
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const i18n = useI18n();

// states
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
onNuxtReady(() => emits('on-updated'));
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('convene.history.pullByDay') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <bar
        :options="{
          responsive: true
        }"
        :data="{
          labels,
          datasets: [
            {
              data: datasets,
              label: $t('convene.history.totalPull'),
              backgroundColor: 'green'
            }
          ]
        }"
      />
    </v-card-text>
  </v-card>
</template>
