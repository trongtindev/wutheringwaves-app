<script setup lang="ts">
import type { IItem } from '~/interfaces/item';

// uses
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const resources = useResources();
const localePath = useLocalePath();

// data
const items = await resources.getItems();

// states
const page = ref(1);
const limit = ref(48);
const matchItems = ref<IItem[]>([]);
const displayItems = ref<IItem[]>([]);
const filterText = ref(route.query.q ? route.query.q.toString() : undefined);
const filterCategory = ref();
const filterRarity = ref(0);
const debouncedSearch = useDebounceFn(() => loadData(), 350);

// functions
const loadData = () => {
  router.replace({
    query: {
      q: filterText.value || undefined
    }
  });

  matchItems.value = items.filter((e) => {
    if (filterText.value) {
      // TODO: search in nameLocalized
      return e.name.toLowerCase().includes(filterText.value.toLowerCase());
    }
    if (filterRarity.value > 0) {
      return e.rarity === filterRarity.value;
    }
    return true;
  });

  const offset = limit.value * page.value - limit.value;
  displayItems.value = matchItems.value.filter((e, i) => {
    return i >= offset && i < offset + limit.value;
  });
};

// computed
const pages = computed(() => {
  return Math.ceil(matchItems.value.length / limit.value);
});

// changes
watch(filterText, () => debouncedSearch());
watch(filterCategory, () => loadData());
watch(filterRarity, () => loadData());

// lifecycle
onMounted(() => loadData());

// seo meta
const title = i18n.t('meta.items.title');
const description = i18n.t('meta.items.description');

useApp().title = i18n.t('items.title');
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
          to: 'items',
          title: i18n.t('items.title')
        }
      ]"
    />

    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="filterText" :label="$t('common.search')" />
          </v-col>

          <v-col cols="6" md="4">
            <v-select
              v-model="filterCategory"
              :label="$t('common.category')"
              :item-title="(e) => e"
            />
          </v-col>

          <v-col cols="6" md="4">
            <v-select
              v-model="filterRarity"
              :label="$t('common.rarity')"
              :items="[0, 1, 2, 3, 4, 5]"
              :item-title="
                (e) => (e === 0 ? i18n.t('All') : `${e} ${i18n.t('Star')}`)
              "
              :item-value="(e) => e"
            />
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col
            v-for="(element, index) in displayItems"
            :key="index"
            cols="6"
            sm="4"
            md="2"
          >
            <v-card :to="localePath(`/items/${element.slug}`)">
              <v-responsive
                :aspect-ratio="1 / 1"
                :style="`background-color: var(${element.rarity === 4 ? '--rarity-purple' : '--rarity-yellow'});`"
              >
                <v-img
                  :src="`/items/icons/${element.slug}.webp`"
                  :alt="$t(element.name)"
                  class="align-end h-100"
                  cover
                />
              </v-responsive>

              <v-tooltip :text="$t(element.name)">
                <template #activator="{ props }">
                  <v-card-title v-bind="props" class="text-center">
                    {{ $t(element.name) }}
                  </v-card-title>
                </template>
              </v-tooltip>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex justify-center">
        <client-only>
          <v-pagination v-model="page" :length="pages" />
        </client-only>
      </v-card-actions>
    </v-card>
  </div>
</template>
