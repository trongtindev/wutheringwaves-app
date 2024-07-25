<script setup lang="ts">
import type { CharacterDocument } from '~/collections/character';
import { mdiMagnify, mdiFilterCog } from '@mdi/js';

const i18n = useI18n();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// fetch
const result = await resources.getCharacters();
const attributes = await resources.getAttributes();
const characters = result.sort((a, b) => a.name.localeCompare(b.name));

// states
const owned = ref<{ [key: string]: CharacterDocument }>();
const filter = ref();
const filterText = ref<string>();
const filterRarity = ref<number>(0);
const filterAttributes = ref<string[]>([]);

// functions
const loadOwned = () => {
  // console.log(JSON.stringify(characters.map((e) => e.name)));

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

// events
const onAttributeToggle = (id: string) => {
  if (filterAttributes.value.includes(id)) {
    const index = filterAttributes.value.findIndex((e) => e === id);
    if (index >= 0) filterAttributes.value.splice(index, 1);
  } else {
    filterAttributes.value.push(id);
  }
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

    // if (filterAttributes.value.length > 0) {
    //   if (filterAttributes.value.includes(e.attribute)) {
    //     return false;
    //   }
    // }

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
  <!-- alert -->
  <base-alert id="characters" :text="$t('characters.message')" class="mb-2" />

  <!-- filter -->
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
        @click.prevent="() => (filter = !filter)"
      />
    </template>
  </v-text-field>

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
      <character-card
        :item="element"
        :portrait="true"
        :sequences="
          owned && owned[element.name]
            ? owned[element.name].resonanceChain
            : undefined
        "
      />
    </v-col>
  </v-row>

  <!-- filter -->
  <v-bottom-sheet v-model="filter" :inset="true">
    <v-card :title="$t('common.filter')">
      <v-card-text> something </v-card-text>

      <v-card-actions>
        <v-btn :text="$t('common.reset')" />
        <v-spacer />
        <v-btn :text="$t('common.apply')" />
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>
