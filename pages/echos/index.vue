<script setup lang="ts">
import type { IEcho } from '~/interfaces/echo';

const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();

// states
const echos = await resources.echos();
const filterText = ref<string>();
const filterCost = ref<number>(0);
const filterSonataEffect = ref<string>('All');
const items = ref<IEcho[]>([]);
const sonataEffects = ref<string[]>([]);

// functions
const initialize = () => {
  const effects: string[] = [];
  echos.forEach((e) => {
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
  items.value = echos.filter((e) => {
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
const title = i18n.t('meta.echos.title');
const description = i18n.t('meta.echos.description');

useApp().title = i18n.t('echos.title');
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
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/echos',
          title: i18n.t('Echos')
        }
      ]"
    />

    <v-card>
      <v-card-text>
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
              :label="$t('echos.cost')"
              :items="[0, 1, 3, 4]"
              :item-title="(e: number) => (e === 0 ? i18n.t('common.all') : e)"
              :hide-details="true"
            />
          </v-col>

          <v-col cols="6" sm="4">
            <v-select
              v-model="filterSonataEffect"
              :label="$t('echos.sonataEffect')"
              :items="['All', ...sonataEffects]"
              :item-title="(e: number) => i18n.t(e)"
              :hide-details="true"
            />
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col
            v-for="(element, index) in items"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="localePath(`/echos/${element.slug}`)">
              <v-responsive :aspect-ratio="1">
                <v-img
                  :src="`/echos/icons/${element.slug}.webp`"
                  class="align-end h-100"
                  cover
                />
              </v-responsive>
              <v-divider />

              <v-card-title class="text-center">
                {{ $t(element.name) }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
