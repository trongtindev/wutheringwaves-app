<script setup lang="ts">
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// states
const items = await resources.getTrophies();
const item = items.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

// seo meta
const title = `${i18n.t('common.trophy')}: ${nameLocalized.value}`;
const description = i18n.t(item.description);
const ogImage = `${runtimeConfig.public.SITE_URL}/trophies/icons/${item.slug}.webp`;

useApp().title = i18n.t('trophies.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  license: `${runtimeConfig.public.SITE_URL}/license`,
  acquireLicensePage: `${runtimeConfig.public.SITE_URL}/license/#how-to-use`,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  },
  copyrightNotice: 'trongtindev'
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: useRuntimeConfig().public.SITE_URL
    },
    { '@type': 'ListItem', position: 2, name: i18n.t('trophies.title') }
  ]
});
</script>

<template>
  <div>
    <v-card>
      <card-title>
        <template #title>
          <h1 class="text-h6">{{ i18n.t(item.name) }}</h1>
        </template>

        <template #actions>
          <edit-this-page
            :path="`tree/main/resources/trophies/${item.slug}.json`"
          />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="`/trophies/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="item.group" />
              <v-chip :text="item.category" />
            </div>

            <div class="mt-2">
              {{ item.description }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div class="mt-2">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
