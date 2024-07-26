<script setup lang="ts">
import { mdiPlus, mdiMagnify, mdiFilterCog } from '@mdi/js';
import type { IListResponse } from '~/interfaces/api';
import type { IPost, IPostCategory } from '~/interfaces/post';

// uses
const api = useApi();
const i18n = useI18n();
const { API_URL } = useRuntimeConfig().public;
const localePath = useLocalePath();
const fetchDebounce = useDebounceFn(() => fetch(), 500);

// fetch
const categories = await api.get<IListResponse<IPostCategory>>(
  'posts/categories',
  {
    params: {
      languages: [i18n.locale.value]
    }
  }
);

// states
const data = ref<IListResponse<IPost> | null>();
const state = ref<'' | 'fetch'>('');
const filter = ref();
const filterTitle = ref();
const filterLanguages = ref<string[]>([i18n.locale.value]);
const filterCategories = ref<string[]>([]);

// functions
const fetch = () => {
  if (import.meta.client) {
    data.value = null;
    state.value = 'fetch';
    filter.value = false;
  }

  api
    .get<IListResponse<IPost>>(`${API_URL}/posts`)
    .then((result) => {
      data.value = result.data;
    })
    .catch(console.error)
    .finally(() => {
      if (import.meta.client) state.value = '';
    });
};

// changes
watch(
  () => filterTitle.value,
  () => fetchDebounce()
);
watch(
  () => filterCategories.value,
  () => fetchDebounce()
);

// lifecycle
fetch(); // no need onMounted

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
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: 'guides',
          title: i18n.t('guides.title')
        }
      ]"
    />

    <!-- input -->
    <v-text-field
      v-model="filterTitle"
      :placeholder="$t('common.searchPlaceholder')"
      :hide-details="true"
      :prepend-inner-icon="mdiMagnify"
      :loading="state == 'fetch'"
    >
      <template #append-inner>
        <v-btn
          :text="$t('common.filter')"
          :append-icon="mdiFilterCog"
          variant="tonal"
          @mousedown.stop
          @mouseup.stop
          @click.stop="() => (filter = !filter)"
        />
      </template>
    </v-text-field>
    <!-- <v-row>
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
  </v-row> -->

    <!-- list -->
    <v-row v-if="data">
      <v-col
        v-for="(item, index) in data.items"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <post-card :item="item" />
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

      <!-- filter -->
      <v-bottom-sheet v-model="filter" :inset="true">
        <v-card>
          <v-card-title>
            {{ $t('common.filter') }}
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-select
              v-model="filterLanguages"
              :items="i18n.locales.value"
              :placeholder="$t('guides.filter.language')"
              :multiple="true"
              item-title="name"
              item-value="code"
            />

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
          </v-card-text>
          <v-divider />

          <v-card-actions>
            <v-btn :text="$t('common.reset')" />
            <v-spacer />
            <v-btn
              variant="flat"
              :text="$t('common.apply')"
              @click="() => fetch()"
            />
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
    </client-only>
  </div>
</template>
