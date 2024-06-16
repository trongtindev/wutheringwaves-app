<script setup lang="ts">
// uses
const i18n = useI18n();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  items: {
    title: string;
    disabled?: boolean;
    to: string;
  }[];
}>();

// states
const tempHTMLScriptElement = ref<Element[]>([]);

// functions

// lifecycle
onMounted(() => {
  const json = {
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
  };

  let element = document.querySelector('#BreadcrumbList');
  if (!element) {
    element = document.createElement('script');
    element.id = '#BreadcrumbList';
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
    tempHTMLScriptElement.value.push(element);
  }

  element.textContent = JSON.stringify(json);
});

onUnmounted(() => {
  tempHTMLScriptElement.value.forEach((e) => e.remove());
});
</script>

<template>
  <!-- TODO: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=en#json-ld_1 -->

  <v-breadcrumbs
    class="pt-0"
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
  </v-breadcrumbs>
</template>
