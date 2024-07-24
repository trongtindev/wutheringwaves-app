<script setup lang="ts">
import { mdiDatabaseSearch, mdiClose } from '@mdi/js';
import type { ICharacter } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';
import type { IItem } from '~/interfaces/item';
import { SearchResultType, type ISearchResult } from '~/interfaces/search';
import type { ITrophy } from '~/interfaces/trophy';
import type { IWeapon } from '~/interfaces/weapon';

// uses
const search = useSearch();
const resources = useResources();
const { isDesktop } = useDevice();
const submitDebounce = useDebounceFn(() => submit(), 500);

// states
const state = ref<'' | 'submit'>('');
const characters = ref<ICharacter[]>();
const weapons = ref<IWeapon[]>();
const echoes = ref<IEcho[]>();
const items = ref<IItem[]>();
const trophies = ref<ITrophy[]>();
const keyword = ref<string>();
const results = ref<ISearchResult[]>([]);

// functions
const submit = async () => {
  try {
    state.value = 'submit';

    // reset
    results.value = [];
    if (!keyword.value) return;
    const lowerCase = keyword.value.toLowerCase();

    // characters
    characters.value ??= await resources.getCharacters();
    const matchCharacters = characters.value.filter((e) => {
      return e.name.toLowerCase().includes(lowerCase);
    });
    results.value = [
      ...results.value,
      ...matchCharacters.splice(0, 5).map((e) => {
        return {
          type: SearchResultType.character,
          slug: `/characters/${e.slug}`,
          icon: `/characters/icons/${e.slug}.webp`,
          name: e.name,
          rarity: e.rarity
        };
      })
    ];

    // echoes
    weapons.value ??= await resources.getWeapons();
    const matchWeapons = weapons.value.filter((e) => {
      return e.name.toLowerCase().includes(lowerCase);
    });
    results.value = [
      ...results.value,
      ...matchWeapons.splice(0, 5).map((e) => {
        return {
          type: SearchResultType.weapon,
          slug: `/weapons/${e.slug}`,
          icon: `/weapons/icons/${e.slug}.webp`,
          name: e.name,
          rarity: e.rarity
        };
      })
    ];

    // echoes
    echoes.value ??= await resources.getEchoes();
    const matchEchos = echoes.value.filter((e) => {
      return e.name.toLowerCase().includes(lowerCase);
    });
    results.value = [
      ...results.value,
      ...matchEchos.splice(0, 5).map((e) => {
        return {
          type: SearchResultType.echo,
          slug: `/echoes/${e.slug}`,
          icon: `/echoes/icons/${e.slug}.webp`,
          name: e.name
        };
      })
    ];

    // items
    items.value ??= await resources.getItems();
    const matchItems = items.value.filter((e) => {
      return e.name.toLowerCase().includes(lowerCase);
    });
    results.value = [
      ...results.value,
      ...matchItems.splice(0, 5).map((e) => {
        return {
          type: SearchResultType.item,
          slug: `/items/${e.slug}`,
          icon: `/items/icons/${e.slug}.webp`,
          name: e.name,
          rarity: e.rarity
        };
      })
    ];

    trophies.value ??= await resources.getTrophies();
    const matchTrophies = trophies.value.filter((e) => {
      return e.name.toLowerCase().includes(lowerCase);
    });
    results.value = [
      ...results.value,
      ...matchTrophies.splice(0, 5).map((e) => {
        return {
          type: SearchResultType.trophy,
          slug: `/trophies/${e.slug}`,
          icon: `/trophies/icons/${e.slug}.webp`,
          name: e.name
        };
      })
    ];

    console.log('submit');
  } catch (error) {
    alert(error);
    console.error(error);
  } finally {
    state.value = '';
  }
};

// listens
watch(() => keyword.value, submitDebounce);
</script>

<template>
  <v-dialog v-model="search.active" :scrollable="true" :width="720">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col class="d-flex align-center">
            {{ $t('search.title') }}
          </v-col>
          <v-col class="d-flex align-center justify-end">
            <v-btn
              size="x-small"
              :icon="mdiClose"
              variant="text"
              @click="() => (search.active = false)"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-form>
          <alert id="search.alert" :text="$t('search.alert')" />
          <alert
            v-if="isDesktop"
            id="search.alert"
            :text="$t('search.alertTips')"
          />
          <v-text-field
            v-model="keyword"
            :placeholder="$t('search.placeholder')"
            :prepend-inner-icon="mdiDatabaseSearch"
            :clearable="true"
            :loading="state == 'submit'"
          />
        </v-form>

        <v-list v-if="results.length > 0 && keyword">
          <search-result-item
            v-for="(element, index) in results"
            :key="index"
            :data="element"
          />
        </v-list>
        <!-- <v-card-text
          v-else-if="results.length == 0 && keyword"
          class="text-center"
        >
          {{ $t('search.noResults') }}
        </v-card-text> -->
      </v-card-text>
      <v-divider />
    </v-card>
  </v-dialog>
</template>
