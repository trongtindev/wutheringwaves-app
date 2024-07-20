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
  }),
  meta: [
    {
      name: 'keywords',
      content:
        'wuthering code, wuthering waves code, wuthering gift code, wuthering waves gift code'
    }
  ]
});
useSeoMeta({
  description,
  ogDescription: description
});
</script>

<template>
  <v-card>
    <v-card-title tag="h1">
      {{ $t('codes.title') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-table class="border rounded">
        <thead>
          <tr>
            <td class="border-b" style="width: 40%">{{ $t('codes.code') }}</td>
            <td class="border-b" style="width: 40%">
              {{ $t('codes.rewards') }}
            </td>
            <td class="border-b" style="width: 20%">
              {{ $t('codes.expiry') }}
            </td>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(element, index) in items"
            :key="index"
            :class="{ 'mt-2': index > 0 }"
          >
            <codes-item :data="element" />
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <!-- comments -->
  <comments channel="codes" class="mt-2" />
</template>
