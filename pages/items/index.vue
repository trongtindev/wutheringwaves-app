<script setup lang="ts">
import type { IItem } from '~/interfaces/item';

// uses
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const resources = useResources();

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
const debouncedSearch = useDebounceFn(() => initialize(), 350);

// functions
const initialize = () => {
  // console.log(JSON.stringify(items.map((e) => e.slug)));

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
watch(filterCategory, () => initialize());
watch(filterRarity, () => initialize());

// lifecycle
onMounted(() => initialize());

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
  <!-- filter -->
  <v-row>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="filterText"
        :label="$t('common.search')"
        :hide-details="true"
      />
    </v-col>

    <v-col cols="6" md="4">
      <v-select
        v-model="filterCategory"
        :label="$t('common.category')"
        :item-title="(e) => e"
        :hide-details="true"
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
        :hide-details="true"
      />
    </v-col>
  </v-row>

  <!-- list -->
  <v-row>
    <v-col
      v-for="(item, index) in displayItems"
      :key="index"
      cols="6"
      sm="4"
      md="2"
    >
      <item-card :item="item" />
    </v-col>
  </v-row>

  <client-only>
    <v-pagination v-model="page" :length="pages" />
  </client-only>
</template>
