<script setup lang="ts">
const i18n = useI18n();
const resources = useResources();
const database = useDatabase();
const account = useAccount();
const importConvene = useImportConvene();

// states
const weapons = await resources.getWeapons();
const filterText = ref<string>();
const filterType = ref<string>('All');
const filterRarity = ref<number>(0);
const obtainedCount = ref({});

// computed
const items = computed(() => {
  return weapons.filter((e) => {
    if (filterText.value && filterText.value.length > 0) {
      if (!e.name.toLowerCase().includes(filterText.value.toLowerCase())) {
        return false;
      }
    }

    if (filterType.value && filterType.value !== 'All') {
      if (e.type !== filterType.value) {
        return false;
      }
    }

    const rarity = parseInt(`${filterRarity.value}` || '0');
    if (rarity > 0) {
      if (e.rarity != rarity) {
        return false;
      }
    }

    return true;
  });
});

const categories = computed(() => {
  const items: string[] = [];
  weapons.forEach((e) => {
    if (!items.includes(e.type)) {
      items.push(e.type);
    }
  });
  return items;
});

// functions
const calculatorOwned = () => {
  if (!account.active) return;

  const docs = database.weapons
    .find({
      playerId: account.active.playerId,
    })
    .map((e) => e[1]);
  obtainedCount.value = Object.fromEntries(
    docs.map((doc) => [doc.resourceId, doc.count]),
  );
};

// changes
watch(
  () => importConvene.onImported,
  () => calculatorOwned(),
);

watch(
  () => account.active,
  () => calculatorOwned(),
);

// lifecycle
onNuxtReady(() => {
  if (import.meta.dev) {
    console.debug(JSON.stringify(weapons.map((e) => e.name)));
    console.debug(JSON.stringify(weapons.map((e) => e.slug)));
  }

  calculatorOwned();
});

// seo meta
const title = i18n.t('meta.weapons.title');
const description = i18n.t('meta.weapons.description');

useAppBar().title = i18n.t('weapons.title');
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- alert -->
    <base-alert id="weapons.alert" :text="$t('weapons.alert')" delay />

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
          v-model="filterType"
          :label="$t('Type')"
          :items="['All', ...categories]"
          :item-title="(e) => i18n.t(e)"
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
          :hide-details="true"
        />
      </v-col>
    </v-row>

    <!-- list -->
    <v-row class="mt-1">
      <v-col
        v-for="(element, index) in items"
        :key="index"
        cols="6"
        sm="4"
        md="2"
      >
        <weapon-card
          :item="element"
          :obtained-count="obtainedCount[element.id]"
        />
      </v-col>
    </v-row>
  </div>
</template>
