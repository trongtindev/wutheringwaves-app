<script setup lang="ts">
// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// fetch
const characters = await resources.getCharacters();
const characterDict = Object.fromEntries(characters.map((e) => [e.slug, e]));

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

const suggestedCharacters = computed(() => {
  if (item.suggestedCharacters) {
    return item.suggestedCharacters.map((slug) => {
      return characterDict[slug];
    });
  }
  return [];
});

// seo meta
const title = `${i18n.t('common.echo')}: ${nameLocalized.value}`;
const description = i18n.t('meta.echos.description', {
  name: nameLocalized.value,
  rarity: item.class
});
const ogImage = `${runtimeConfig.public.SITE_URL}/echos/icons/${item.slug}.webp`;

useApp().title = i18n.t('echos.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
  articlePublishedTime: data.publishedTime,
  articleModifiedTime: data.modifiedTime
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  }
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
    { '@type': 'ListItem', position: 2, name: i18n.t('echos.title') }
  ]
});
</script>

<template>
  <div v-if="item">
    <v-card>
      <v-card-title tag="h1">
        {{ nameLocalized }}
      </v-card-title>
      <v-divider />

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

    <!-- Suggested Characters -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('echos.suggestedCharacters', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col
            v-for="(element, index) in suggestedCharacters"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <character-card
              :data="element"
              :custom-name="`${element.name} Build`"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div class="mt-2">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
