<script setup lang="ts">
import fs from 'fs';

const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// states
const echos = await resources.echos();
const item = echos.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });
const data = await resources.getEchoData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const skillDescription = computed(() => {
  return data.skill.description;
  // const params = [data.skill.params[0], `${data.skill.cd}`];
  // return data.skill.description.replace(
  //   /\{(\d+)\}/g,
  //   (_, index) => params[index]
  // );
});

// seo meta
const title = `${i18n.t('common.echo')}: ${nameLocalized.value}`;
const description = i18n.t('meta.echos.description', {
  name: nameLocalized.value,
  rarity: item.class
});
const ogImage = `${runtimeConfig.public.SITE_URL}/echos/icons/${item.slug}.webp`;

let articlePublishedTime: string | undefined = undefined;
let articleModifiedTime: string | undefined = undefined;
if (import.meta.server) {
  const stats = fs.statSync(`./resources/echos/${item.slug}.json`);
  articlePublishedTime = stats.birthtime.toISOString();
  articleModifiedTime = stats.atime.toISOString();
}

useApp().title = i18n.t('echos.title');
useHead({ title });
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
  articlePublishedTime: articlePublishedTime,
  articleModifiedTime: articleModifiedTime
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  creditText: 'Wuthering Waves',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  }
});
</script>

<template>
  <div v-if="item">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/echos',
          title: i18n.t('echos.title')
        },
        {
          to: `/echos/${item.slug}`,
          title: i18n.t(item.name)
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ nameLocalized }}
        </template>

        <template #actions>
          <edit-this-page
            :path="`/tree/main/resources/echos/${item.slug}.json`"
          />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img :src="`/echos/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="`${item.cost} ${$t('echos.cost')}`" />
              <v-chip :text="$t(item.class)" />
              <v-chip :text="$t(item.attribute)" />
            </div>

            <div class="mt-2">
              <div :innerHTML="skillDescription"></div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Sonata Effect -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('echos.sonataEffect') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ item.sonataEffects }}
      </v-card-text>
    </v-card>

    <div class="mt-2">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
