<script setup lang="ts">
import { mdiFilterCog, mdiMagnify } from '@mdi/js';
import type { CharacterDocument } from '~/database/documents/character';

const i18n = useI18n();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// fetch
const result = await resources.getCharacters({ hidden: false });
const characters = result.sort((a, b) => a.name.localeCompare(b.name));

// states
const owned = ref<{ [key: string]: CharacterDocument }>();
const filter = ref();
const filterText = ref<string>();
const filterRarity = ref<number>(0);
const filterAttributes = ref<string[]>([]);

// functions
const initialize = () => {
  if (import.meta.dev) {
    console.debug(JSON.stringify(characters.map((e) => e.name)));
    console.debug(JSON.stringify(characters.map((e) => e.slug)));
  }

  if (account.active) loadOwned();
};

const loadOwned = () => {
  if (!account.active) return;

  const docs = database.characters
    .find({
      playerId: account.active.playerId,
    })
    .map((e) => e[1]);

  if (docs.length > 0) {
    owned.value = docs.reduce((acc, e) => ((acc[e.resourceId] = e), acc), {});
  } else {
    owned.value = {};
  }
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
watch(() => account.active, loadOwned);

// lifecycle
onMounted(initialize);

// seo meta
const title = i18n.t('characters.title');
const description = i18n.t('meta.characters.description');

useAppBar().title = i18n.t('characters.title');
useHead({
  title,
});
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <!-- alert -->
    <base-alert
      id="characters.message"
      class="mb-2"
      :text="$t('characters.message')"
      :closable="true"
      delay
    />

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
            owned && owned[element.id] ? owned[element.id].sequences : undefined
          "
        />
      </v-col>
    </v-row>

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
          <v-btn :text="$t('common.apply')" />
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
