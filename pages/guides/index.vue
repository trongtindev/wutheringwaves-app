<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { IListResponse } from '~/interfaces/api';
import type { IGuide } from '~/interfaces/guide';
import type { IPost, IPostCategory } from '~/interfaces/post';

// uses
const api = useApi();
const i18n = useI18n();
const { API_URL } = useRuntimeConfig().public;
const localePath = useLocalePath();
const initializeDebounce = useDebounceFn(() => initialize(), 1000);

// fetch
const categories = await api
  .getInstance()
  .get<IListResponse<IPostCategory>>('guides/categories');

// states
const data = ref<IListResponse<IGuide>>();
const filterTitle = ref();
const filterCategories = ref<string[]>([]);

// functions
const initialize = () => {
  api
    .getInstance()
    .get<IListResponse<IGuide>>(`${API_URL}/posts`)
    .then((result) => {
      data.value = result.data;
    })
    .catch(console.error);
};

// changes
watch(
  () => filterTitle.value,
  () => initializeDebounce()
);
watch(
  () => filterCategories.value,
  () => initializeDebounce()
);

// lifecycle
onMounted(() => initialize());

// seo meta
const title = i18n.t('meta.guides.title');
const description = i18n.t('meta.guides.description');

useApp().title = i18n.t('guides.title');
useHead({ title });
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <!-- breadcrumbs -->
  <breadcrumbs
    :items="[
      {
        to: 'guides',
        title: i18n.t('guides.title')
      }
    ]"
  />

  <!-- filter -->
  <v-row>
    <v-col>
      <v-text-field
        v-model="filterTitle"
        :placeholder="$t('guides.filter.title')"
        :hide-details="true"
      />
    </v-col>

    <v-col>
      <v-select
        v-model="filterCategories"
        :placeholder="$t('guides.filter.categories')"
        :hide-details="true"
        :multiple="true"
        :items="categories.data.items"
        :item-title="
          (e) => {
            if (e.nameLocalized[i18n.locale.value]) {
              return e.nameLocalized[i18n.locale.value];
            }
            return e.name;
          }
        "
        item-value="id"
      />
    </v-col>
  </v-row>

  <!-- list -->
  <v-row v-if="!data">
    <v-col v-for="index in 9" :key="index" cols="12" sm="6" md="4">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col
      v-for="(item, index) in data.items"
      :key="index"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card :to="localePath(`/guides/${item.slug}`)">
        <v-img
          :aspect-ratio="1.91 / 1"
          :src="item.thumbnail ? item.thumbnail.url : undefined"
          :cover="true"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center h-100">
              <v-progress-circular :indeterminate="true" />
            </div>
          </template>
        </v-img>

        <v-card-title tag="h2">
          {{ item.title }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>

  <client-only>
    <v-fab
      :to="localePath('/guides/editor')"
      :prepend-icon="mdiPlus"
      rel="nofollow"
      location="bottom end"
      size="64"
      fixed
      app
      appear
    />
  </client-only>
</template>
