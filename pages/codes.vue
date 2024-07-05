<script setup lang="ts">
import dayjs from 'dayjs';

// uses
const i18n = useI18n();
const resources = useResources();

// states
const items = (await resources.getCodes()).sort((a, b) => {
  const aExpiredAt = dayjs(a.expiredAt ?? 0);
  const bExpiredAt = dayjs(b.expiredAt ?? 0);
  return aExpiredAt.toDate().getTime() - bExpiredAt.toDate().getTime();
});

// seo meta
const description = i18n.t('meta.codes.description');

useApp().title = i18n.t('codes.title');
useHead({
  title: i18n.t('meta.codes.title', {
    time: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
  })
});
useSeoMeta({
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
          to: '/codes',
          title: i18n.t('codes.title')
        }
      ]"
    />

    <v-card>
      <v-list>
        <codes-item
          v-for="(element, index) in items"
          :key="index"
          :data="element"
        />
      </v-list>
    </v-card>
  </div>
</template>
