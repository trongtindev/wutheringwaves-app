<script setup lang="ts">
import { mdiFilterCog, mdiMagnify } from '@mdi/js';
import type { IItem } from '~/interfaces/item';

// uses
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const resources = useResources();
const searchDebounce = useDebounceFn(() => initialize(), 350);

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

const filter = ref();

// functions
const initialize = () => {
  // console.log(JSON.stringify(items.map((e) => e.slug)));

  router.replace({
    query: {
      q: filterText.value || undefined,
    },
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
watch(filterText, () => searchDebounce());
watch(filterCategory, () => initialize());
watch(filterRarity, () => initialize());

// lifecycle
onMounted(() => initialize());

// seo meta
const title = i18n.t('meta.items.title');
const description = i18n.t('meta.items.description');

useAppBar().title = i18n.t('items.title');
useHead({ title });
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <!-- input -->
    <v-text-field
      v-model="filterText"
      :placeholder="$t('common.searchPlaceholder')"
      :hide-details="true"
      :prepend-inner-icon="mdiMagnify"
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

    <!-- list -->
    <v-row class="mt-1">
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

    <!-- filter -->
    <v-bottom-sheet v-model="filter" :inset="true">
      <v-card>
        <v-card-title>
          {{ $t('common.filter') }}
        </v-card-title>
        <v-divider />

        <v-card-text> something </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-btn :text="$t('common.reset')" />
          <v-spacer />
          <v-btn variant="flat" :text="$t('common.apply')" />
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
