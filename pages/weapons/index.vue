<script setup lang="ts">
import type { IWeapon } from '@/interfaces/weapon';

const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();

// states
const weapons = ref<IWeapon[]>(await resources.weapons());
const filterText = ref<string>();
const filterType = ref<string>('All');
const filterRarity = ref<number>(0);

// computed
const items = computed(() => {
  return weapons.value.filter((e) => {
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
  weapons.value.forEach((e) => {
    if (!items.includes(e.type)) {
      items.push(e.type);
    }
  });
  return items;
});

// seo meta
const title = i18n.t('meta.weapons.title');
const description = i18n.t('meta.weapons.description');

useHead({ title });

useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: 'weapons',
          title: i18n.t('weapons.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t('weapons.title') }} ({{ items.length }})
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card-text>
        <client-only>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filterText"
                :label="$t('Search')"
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
                :label="$t('Rarity')"
                :items="[0, 1, 2, 3, 4, 5]"
                :item-title="
                  (e) => (e === 0 ? i18n.t('All') : `${e} ${i18n.t('Star')}`)
                "
                :hide-details="true"
              />
            </v-col>
          </v-row>
        </client-only>

        <v-row class="mt-2">
          <v-col
            v-for="(element, index) in items"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="localePath(`/weapons/${element.slug}`)">
              <v-responsive
                :aspect-ratio="1"
                :style="`background-color: var(--color-background-rarity${element.rarity});`"
              >
                <v-img
                  class="align-end h-100"
                  :src="`/weapons/icons/${element.slug}.webp`"
                  :cover="true"
                />
              </v-responsive>
              <v-divider />

              <v-card-title
                class="text-center"
                :class="`text-rarity${element.rarity}`"
              >
                {{ $t(element.name) }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
