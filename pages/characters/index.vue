<script setup lang="ts">
import type { CharacterDocument } from '~/collections/character';

const i18n = useI18n();
const resources = useResources();
const localePath = useLocalePath();
const database = useDatabase();
const account = useAccount();

// fetch
const result = await resources.characters();
const characters = result.sort((a, b) => a.name.localeCompare(b.name));

// states
const owned = ref<{ [key: string]: CharacterDocument }>();
const filterText = ref<string>();
const filterRarity = ref<number>(0);
const filterAttribute = ref<string>('All');

// functions
const loadOwned = () => {
  database
    .getInstance()
    .then((db) => {
      db.characters
        .find({
          selector: {
            playerId: account.active
          }
        })
        .exec()
        .then((result) => {
          if (result.length > 0) {
            owned.value = result.reduce(
              (acc, e) => ((acc[e.name] = e), acc),
              {}
            );
          } else {
            owned.value = {};
          }
        });
    })
    .catch(console.error);
};

// computed
const items = computed(() => {
  return characters.filter((e) => {
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

// changes
watch(
  () => account.active,
  (value) => {
    if (value) loadOwned();
  }
);

// lifecycle
onMounted(() => loadOwned());

// seo meta
const title = i18n.t('characters.title');
const description = i18n.t('meta.characters.description');

useApp().title = i18n.t('characters.title');
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
    <!-- alert -->
    <alert id="characters" :text="$t('characters.alert')" />

    <!-- page -->
    <v-card>
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

        <v-row class="mt-2">
          <v-col
            v-for="(element, index) in items"
            :key="index"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <character-card :data="element" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
