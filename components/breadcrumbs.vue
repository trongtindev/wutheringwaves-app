<script setup lang="ts">
// define
const props = defineProps<{
  items: {
    title: string;
    disabled?: boolean;
    to: string;
  }[];
}>();

// uses
// const i18n = useI18n();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

// seo meta
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: props.items.map((e, i) => {
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: e.title,
      item: `${runtimeConfig.public.SITE_URL}${e.to ? localePath(e.to) : ''}`
    };
  })
});
</script>

<template>
  <div></div>
  <!-- <v-breadcrumbs
    class="pt-1"
    :items="[
      {
        title: i18n.t('common.home'),
        to: localePath('/')
      },
      ...props.items.map((e) => {
        return {
          ...e,
          to: e.to ? localePath(e.to) : undefined
        };
      })
    ]"
  >
    <template #title="{ item }">
      {{ item.title }}
    </template>
  </v-breadcrumbs> -->
</template>
