<script setup lang="ts">
const { SITE_URL, SITE_NAME } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();

// states
const echoes = await resources.getEchoes();
const item = echoes.find((e) => e.slug === route.params.id)!;
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

const relatedEchoes = computed(() => {
  return echoes.filter((e) => {
    return e.attribute == item.attribute && e.name != item.name;
  });
});

// seo meta
const title = `${i18n.t('common.echo')}: ${nameLocalized.value}`;
const description = i18n.t('meta.echoes.id.description', {
  name: nameLocalized.value,
  rarity: item.class,
});
const ogImage = `${SITE_URL}/echoes/icons/${item.slug}.webp`;

useAppBar().title = i18n.t('echoes.title');
useHead({ title });
useSeoMeta({
  ogType: 'article',
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512-maskable.png`,
  },
  url: `${SITE_URL}/echoes/${item.slug}`,
  image: ogImage,
  thumbnailUrl: ogImage,
  description,
  dateCreated: item.publishedTime,
  datePublished: item.publishedTime,
  dateModified: item.modifiedTime,
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves',
  },
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: useRuntimeConfig().public.SITE_URL,
    },
    { '@type': 'ListItem', position: 2, name: i18n.t('echoes.title') },
  ],
});

// https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget#if-modified-since
if (headers['if-modified-since']) {
  const modifiedSince = new Date(headers['if-modified-since']);
  const modifiedTime = new Date(item.modifiedTime);
  if (modifiedSince.getTime() >= modifiedTime.getTime()) {
    setResponseStatus(event!, 304);
  }
}
</script>

<template>
  <div>
    <!-- chips -->
    <header-chips
      class="mb-2"
      :github="`tree/main/resources/echoes/${item.slug}.json`"
    />

    <!-- page -->
    <v-card class="mt-2">
      <v-card-title tag="h1">
        {{ nameLocalized }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img :src="`/echoes/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <h2
              :innerHTML="
                $t('echoes.introduction', {
                  name: nameLocalized,
                  cost: item.cost,
                })
              "
              class="text-body-2"
            />
            <div :innerHTML="skillDescription" class="mt-2"></div>

            <v-table class="border rounded mt-2">
              <thead>
                <tr>
                  <th colspan="3" class="ma-2 text-center font-weight-bold">
                    {{ $t('characters.information') }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <!-- rarity -->
                <tr class="rarity">
                  <td class="w-50 text-center">
                    {{ $t('common.cost') }}
                  </td>
                  <td class="w-50 text-center">
                    {{ item.cost }}
                  </td>
                </tr>

                <!-- attribute -->
                <tr class="attribute">
                  <td class="w-50 text-center">
                    {{ $t('common.attribute') }}
                  </td>
                  <td class="w-50 text-center">
                    <span v-if="item.attribute">
                      <img :src="item.attribute.icon" :width="16" />
                      {{ item.attribute.name }}
                    </span>
                    <span v-else>
                      {{ $t('common.none') }}
                    </span>
                  </td>
                </tr>

                <!-- attribute -->
                <tr class="attribute">
                  <td class="w-50 text-center">
                    {{ $t('common.attribute') }}
                  </td>
                  <td class="w-50 text-center">
                    <span v-if="item.attribute">
                      {{ item.attribute.name }}
                    </span>
                    <span v-else>
                      {{ $t('common.none') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Sonata Effect -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('echoes.sonataEffect') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ item.sonataEffects }}
      </v-card-text>
    </v-card>

    <!-- related -->
    <section-title>
      <template #title>
        {{ $t('echoes.related', { name: nameLocalized }) }}
      </template>
    </section-title>

    <div v-if="relatedEchoes.length > 0" class="mt-2">
      <v-row>
        <v-col
          v-for="(element, index) in relatedEchoes"
          :key="index"
          cols="6"
          sm="4"
          md="2"
        >
          <echo-card :item="element" />
        </v-col>
      </v-row>
    </div>

    <!-- comments -->
    <div class="mt-2">
      <comments :channel="`echo.${item.slug}`" />
    </div>
  </div>
</template>
