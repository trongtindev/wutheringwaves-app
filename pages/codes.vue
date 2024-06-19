<script setup lang="ts">
// uses
const i18n = useI18n();
const resources = useResources();

// states
const items = (await resources.getCodes()).sort((a, b) => {
  const aExpiredAt = a.expiredAt ?? new Date(0);
  const bExpiredAt = b.expiredAt ?? new Date(0);
  return aExpiredAt.getTime() - bExpiredAt.getTime();
});

// seo meta
useHead({
  title: i18n.t('meta.codes.title', {
    time: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
  })
});

const description = i18n.t('meta.codes.description');
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
      <card-title>
        <template #title>
          {{ $t('codes.title') }}
        </template>

        <template #actions>
          <contribute-button path="/blob/main/resources/codes.ts" />
        </template>
      </card-title>

      <v-list>
        <CodesCodeItem
          v-for="(element, index) in items"
          :key="index"
          :data="element"
        />
      </v-list>
    </v-card>
  </div>
</template>
