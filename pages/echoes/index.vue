<script setup lang="ts">
import type { IEcho } from '~/interfaces/echo';

const i18n = useI18n();
const resources = useResources();

// states
const echoes = await resources.getEchoes();
const filterText = ref<string>();
const filterCost = ref<number>(0);
const filterSonataEffect = ref<string>('All');
const items = ref<IEcho[]>([]);
const sonataEffects = ref<string[]>([]);

// functions
const initialize = () => {
  const effects: string[] = [];
  echoes.forEach((e) => {
    e.sonataEffects.forEach((effect) => {
      if (effects.includes(effect) === false) {
        effects.push(effect);
      }
    });
  });
  sonataEffects.value = effects;

  loadData();
};

const loadData = () => {
  items.value = echoes.filter((e) => {
    if (filterText.value && filterText.value.length > 0) {
      if (
        e.name.toLowerCase().includes(filterText.value.toLowerCase()) == false
      ) {
        return false;
      }
    }

    if (filterSonataEffect.value && filterSonataEffect.value != 'All') {
      if (e.sonataEffects.includes(filterSonataEffect.value)) {
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
watch(filterText, loadData);
watch(filterCost, loadData);
watch(filterSonataEffect, loadData);

// lifecycle
onMounted(() => initialize());

// seo meta
const title = i18n.t('meta.echoes.title');
const description = i18n.t('meta.echoes.description');

useApp().title = i18n.t('echoes.title');
useHead({ title });
useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- filter -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="filterText"
          :label="$t('common.search')"
          :hide-details="true"
        />
      </v-col>

      <v-col cols="6" sm="4">
        <v-select
          v-model="filterCost"
          :label="$t('echoes.cost')"
          :items="[0, 1, 3, 4]"
          :item-title="(e: number) => (e === 0 ? i18n.t('common.all') : e)"
          :hide-details="true"
        />
      </v-col>

      <v-col cols="6" sm="4">
        <v-select
          v-model="filterSonataEffect"
          :label="$t('echoes.sonataEffect')"
          :items="['All', ...sonataEffects]"
          :item-title="(e: number) => i18n.t(e)"
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
        md="3"
        lg="2"
      >
        <echo-card :item="element" />
      </v-col>
    </v-row>
  </div>
</template>

