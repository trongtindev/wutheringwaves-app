<script setup lang="ts">
import type { ICharacter } from '@/interfaces/character';

const i18n = useI18n();
const resources = useResources();
const localePath = useLocalePath();

// states
const characters = ref<ICharacter[]>([]);
const filterText = ref<string>();
const filterRarity = ref<number>(0);
const filterAttribute = ref<string>('All');

// computed
const items = computed(() => {
  return characters.value.filter((e) => {
    if (filterText.value && filterText.value.length > 0) {
      if (
        e.name.toLowerCase().includes(filterText.value.toLowerCase()) == false
      ) {
        return false;
      }
    }

    if (filterAttribute.value && filterAttribute.value !== 'All') {
      if (e.attribute !== filterAttribute.value) {
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

// functions
const isRecentlyAdded = (time: Date) => {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() - 60 * 60 * 24 * 7);
  return time.getTime() > expiresAt.getTime();
};

// initialize
const result = await resources.characters();
characters.value = result.sort((a, b) => a.name.localeCompare(b.name));

// seo meta
const title = i18n.t('characters.title');
const description = i18n.t('meta.characters.description');

useHead({
  title
});

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
          to: '/characters',
          title: i18n.t('characters.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t('characters.title') }} ({{ items.length }})
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
                v-model="filterAttribute"
                :label="$t('Attribute')"
                :items="['All', 'Aero', 'Glacio', 'Electro', 'Fusion', 'Havoc']"
                :item-title="(e) => e"
                :hide-details="true"
              />
            </v-col>

            <v-col cols="6" md="4">
              <v-select
                v-model="filterRarity"
                :label="$t('Rarity')"
                :items="[0, 4, 5]"
                :item-title="
                  (e) => (e === 0 ? i18n.t('All') : `${e} ${i18n.t('Star')}`)
                "
                :hide-details="true"
              />
            </v-col>
          </v-row>
        </client-only>

        <v-row class="mt-4">
          <v-col
            v-for="(element, index) in items"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="localePath(`/characters/${element.slug}`)">
              <v-responsive
                :aspect-ratio="1"
                :style="`background-color: var(--color-background-rarity${element.rarity});`"
              >
                <v-img
                  :src="`/characters/icons/${element.slug}.webp`"
                  :alt="$t(element.name)"
                  class="align-end h-100"
                  cover
                >
                  <div>
                    <v-img
                      class="bg-grey-darken-3 rounded-circle"
                      style="left: 5px; top: 5px; position: absolute"
                      :width="24"
                      :height="24"
                      :src="`/attributes/icons/${element.attribute.toLowerCase()}.png`"
                      :alt="element.attribute"
                    />
                  </div>
                </v-img>
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
