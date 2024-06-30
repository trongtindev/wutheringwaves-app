<script setup lang="ts">
const i18n = useI18n();
const route = useRoute();
const resources = useResources();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

// states
const items = await resources.getItems();
const itemDict = items.reduce((acc, e) => ((acc[e.name] = e), acc), {});
const item = items.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getItemData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// computed
const title = computed(() => {
  return i18n.t('meta.items.id.title', { name: nameLocalized.value });
});

const description = computed(() => {
  if (item.name.toLowerCase().includes('recipe')) {
    return i18n.t('meta.items.id.description.recipe', {
      name: nameLocalized.value
    });
  }
  return i18n.t('meta.items.id.description.default', {
    name: nameLocalized.value
  });
});

const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const obtainDescriptionLocalized = computed(() => {
  const content =
    data.obtainDescriptionLocalized &&
    data.obtainDescriptionLocalized[i18n.locale.value]
      ? data.obtainDescriptionLocalized[i18n.locale.value]
      : data.obtainDescription;

  if (content) {
    return content;
  } else if (item.name.toLowerCase().includes('waveband')) {
    return i18n.t('items.obtainedFromConvenes', {
      item: nameLocalized.value,
      character: '?'
    });
  }
  return null;
});

// seo meta
const ogImage = `${runtimeConfig.public.SITE_URL}/items/icons/${item.slug}.webp`;

useHead({ title: title.value });

useSeoMeta({
  ogTitle: title.value,
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
  creditText: 'Wuthering Waves',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  },
  copyrightNotice: 'trongtindev'
});
</script>

<template>
  <div v-if="item">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/items',
          title: i18n.t('items.title')
        },
        {
          to: `/items/${item.slug}`,
          title: i18n.t(item.name)
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t(item.name) }}
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="`/items/icons/${item.slug}.webp`" :height="256" />
          </v-col>

          <v-col>
            <div class="d-flex flex-wrap ga-2">
              <v-chip :text="item.id.toString()" />
              <v-chip :text="item.category" />
            </div>

            <div class="mt-2">
              {{ data.description }}
            </div>

            <div v-if="data.bgDescription" class="mt-2">
              <div :innerHTML="data.bgDescription"></div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mt-1">
      <v-col v-if="obtainDescriptionLocalized" cols="12" md="6">
        <!-- obtain -->
        <v-card class="fill-height">
          <v-card-title>
            {{ $t('items.howToObtain', [nameLocalized]) }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div :innerHTML="parseContent(obtainDescriptionLocalized)"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="data.unlockDescription" cols="12" md="6">
        <!-- unlock -->
        <v-card class="fill-height">
          <v-card-title>
            {{ $t('items.howToUnlock', [nameLocalized]) }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div :innerHTML="parseContent(data.unlockDescription)"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="data.cookingIngredients" cols="12" md="6">
        <!-- cookingIngredients -->
        <v-card class="fill-height">
          <v-card-title>
            {{ $t('items.cookingIngredients') }}
          </v-card-title>
          <v-divider />

          <div class="mt-3 mb-3">
            <v-list-item
              v-for="(element, index) in data.cookingIngredients"
              :key="index"
              :to="localePath(`/items/${itemDict[element.item].slug}`)"
              :title="itemDict[element.item].name"
              :subtitle="`x${element.quantity}`"
              target="_blank"
            >
              <template #prepend>
                <v-avatar class="border" rounded>
                  <v-img
                    v-if="itemDict[element.item]"
                    :src="`/items/icons/${itemDict[element.item].slug}.webp`"
                  />
                </v-avatar>
              </template>
            </v-list-item>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-2">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
