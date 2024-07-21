<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { IListResponse } from '~/interfaces/api';
import type { IGuide } from '~/interfaces/guide';

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// states
const items = ref<IListResponse<IGuide>>();

// seo meta
const title = i18n.t('meta.guide.title');
const description = i18n.t('meta.guide.description');

useApp().title = i18n.t('guides.title');
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
          to: 'guides',
          title: i18n.t('guides.title')
        }
      ]"
    />

    <!-- list -->
    <div>
      <v-row>
        <v-col v-for="index in 9" :key="index" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
