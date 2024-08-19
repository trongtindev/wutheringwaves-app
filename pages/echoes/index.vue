<script setup lang="ts">
import type { IEcho } from '~/interfaces/echo';

const i18n = useI18n();
const resources = useResources();

// states
const echoes = await resources.getEchoes();
const filterText = ref<string>();
const filterCost = ref<number>(0);
const items = ref<IEcho[]>([]);

// functions
const initialize = () => {
  items.value = echoes.filter((e) => {
    if (filterText.value && filterText.value.length > 0) {
      if (
        e.name.toLowerCase().includes(filterText.value.toLowerCase()) == false
      ) {
        return false;
      }
    }

    const cost = parseInt(`${filterCost.value}` || '0');
    if (cost > 0) {
      if (e.cost != cost) {
        return false;
      }
    }

    return true;
  });
};

// changes
watch(filterText, initialize);

// lifecycle
onMounted(initialize);

// seo meta
const title = i18n.t('meta.echoes.title');
const description = i18n.t('meta.echoes.description');

useAppBar().title = i18n.t('echoes.title');
useHead({ title });
useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <!-- filter -->
    <v-text-field
      v-model="filterText"
      :label="$t('common.search')"
      :hide-details="true"
    />

    <!-- list -->
    <v-row class="mt-1">
      <v-col
        v-for="(element, index) in items"
        :key="index"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <echo-card :item="element" />
      </v-col>
    </v-row>
  </div>
</template>
