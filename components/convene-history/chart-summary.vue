<script setup lang="ts">
import type { ConveneDocument } from '~/collections/convene';
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
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  convenes?: ConveneDocument[] | undefined;
}>();

// uses
const i18n = useI18n();

// states
const items = ref<ConveneDocument[]>(props.convenes || []);

// computed
const range = computed(() => {
  return Array.from(Array(14).keys()).map((i) => {
    return dayjs().subtract(14 - i, 'day');
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
  }
);
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
