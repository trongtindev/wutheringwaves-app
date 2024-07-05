<script setup lang="ts">
import type { IListResponse } from '@/interfaces/api';
import { type ITierList } from '@/interfaces/tier-list';

// uses
const app = useApp();
const api = useApi();
const i18n = useI18n();
const localePath = useLocalePath();
const debouncedSearch = useDebounceFn(() => loadData(), 500);

// states
const state = ref<'' | 'load'>('');
const data = ref<IListResponse<ITierList>>();
const page = ref(1);
const limit = ref(20);
const search = ref();
const sortBy = ref();
const filterType = ref();

// functions
const loadData = async () => {
  return new Promise((resolve) => {
    state.value = 'load';
    api
      .getInstance()
      .get<IListResponse<ITierList>>('tier-list', {
        params: {
          limit: limit.value,
          offset: page.value * limit.value - limit.value,
          search: search.value ? search.value : undefined,
          sort: sortBy.value ? sortBy.value : undefined,
          type: filterType.value ? filterType.value : undefined
        }
      })
      .then((result) => {
        data.value = result.data;
        app.scrollTop();
        resolve(result);
      })
      .catch((error) => {
        console.error(error);
        resolve(error);
        alert(error);
      })
      .finally(() => {
        state.value = '';
      });
  });
};

// computed
const pages = computed<number>(() => {
  if (data.value) {
    return Math.ceil(data.value.total / limit.value);
  }
  return 0;
});

// changes
watch(
  () => search.value,
  () => debouncedSearch()
);

watch(
  () => sortBy.value,
  () => loadData()
);

watch(
  () => filterType.value,
  () => loadData()
);

watch(
  () => page.value,
  () => loadData()
);

// lifecycle
if (import.meta.client) {
  onMounted(() => loadData());
}

// seo meta
const title = i18n.t('tierList.title');
const description = i18n.t('meta.tierList.description');

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
          to: '/tier-list',
          title: i18n.t('tierList.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t('tierList.title') }}
        </template>

        <template #actions>
          <v-btn
            :to="localePath('/tier-list/create')"
            :text="$t('common.create')"
          />
        </template>
      </card-title>

      <client-only>
        <v-card-text>
          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="search"
                :label="$t('common.search')"
                :loading="state == 'load' && search"
              />
            </v-col>

            <v-col cols="6" sm="4">
              <v-select v-model="filterType" :label="$t('common.type')" />
            </v-col>

            <v-col cols="6" sm="4">
              <v-select v-model="sortBy" :label="$t('common.sort')" />
            </v-col>
          </v-row>

          <v-sheet v-if="!data" class="text-center">
            <v-progress-circular :indeterminate="true" />
          </v-sheet>
          <v-alert
            v-else-if="data.total == 0"
            type="info"
            :text="$t('common.noData')"
          />
          <v-sheet v-else>
            <v-sheet
              v-for="(element, index) in data.items"
              :key="index"
              :class="index > 0 ? 'mt-4' : 'mt-4'"
            >
              <tier-list-item :data="element" />
            </v-sheet>
          </v-sheet>
        </v-card-text>

        <v-divider v-if="pages > 0" />
        <v-card-actions v-if="pages > 0" class="d-flex justify-center">
          <v-pagination v-model="page" :length="pages" />
        </v-card-actions>
      </client-only>
    </v-card>
  </div>
</template>
