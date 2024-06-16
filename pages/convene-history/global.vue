<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);

// uses
const i18n = useI18n();

// states
const filterType = ref();
const filterBanner = ref();

// seo meta
const title = i18n.t('convene.globalStats.title');
const description = i18n.t('convene.globalStats.description');

useHead({ title });

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title')
        },
        {
          to: '/convene-history/global',
          title: i18n.t('Global')
        }
      ]"
    />

    <v-alert
      class="mb-2"
      type="info"
      :text="$t('Global average pity from {0} users submissions')"
    />

    <v-card>
      <v-card-title>
        <v-row>
          <v-col class="d-flex align-center">
            {{ $t('Global Convene Stats') }}
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <back-button class="ml-2" to="/convene-history" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-select
              v-model="filterType"
              :label="$t('Type')"
              :hide-details="true"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-select
              v-model="filterBanner"
              :label="$t('Banner')"
              :hide-details="true"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <Line
          id="pullByDay"
          :options="{
            responsive: true,
            maintainAspectRatio: false
          }"
          :data="{
            labels: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July'
            ],
            datasets: [
              {
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 39, 10, 40, 39, 80, 40]
              }
            ]
          }"
        />
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <Bar
          id="my-chart-id"
          :options="{
            responsive: true
          }"
          :data="{
            labels: ['January', 'February', 'March'],
            datasets: [{ data: [40, 20, 12] }]
          }"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
