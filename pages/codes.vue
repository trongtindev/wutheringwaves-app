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
const title = i18n.t('meta.codes.title', {
  time: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
});
const description = i18n.t('meta.codes.description');

useApp().title = i18n.t('codes.title');
useHead({
  title,
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
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: i18n.t('codes.redeemRequirement'),
      acceptedAnswer: {
        '@type': 'Answer',
        text: i18n.t('codes.redeemRequirementGuide')
      }
    },
    {
      '@type': 'Question',
      name: i18n.t('codes.howToRedeem'),
      acceptedAnswer: {
        '@type': 'Answer',
        text: i18n.t('codes.howToRedeemGuide')
      }
    }
  ]
}));
</script>

<template>
  <!-- chips -->
  <header-chips class="mb-2" :github="`/tree/main/resources/codes.json`" />

  <!-- list -->
  <v-card>
    <v-card-title tag="h1">
      {{ title }}
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

  <!-- How to Redeem -->
  <v-card class="mt-2">
    <v-card-title tag="h2">
      {{ $t('codes.howToRedeem') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      {{ $t('codes.howToRedeemGuide') }}
    </v-card-text>
  </v-card>

  <!-- Redeem Requirement -->
  <v-card class="mt-2">
    <v-card-title tag="h2">
      {{ $t('codes.redeemRequirement') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      {{ $t('codes.redeemRequirementGuide') }}
    </v-card-text>
  </v-card>

  <!-- comments -->
  <comments channel="codes" class="mt-2" />
</template>
