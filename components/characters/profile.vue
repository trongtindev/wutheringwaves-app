<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IItem } from '~/interfaces/item';
import { mdiPlus } from '@mdi/js';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

// uses
const localePath = useLocalePath();
const resources = useResources();

// fetch
const items = await resources.getItems();

// states
const dictItems = ref<{ [key: number]: IItem }>({});

// initialize
if (props.data.ascensions) {
  props.data.ascensions.forEach((e) => {
    e.cost.forEach((cost) => {
      const item = items.find((item) => item.id === cost.item);
      if (item) dictItems.value[cost.item] = item;
    });
  });
}
</script>

<template>
  <!-- Resonance Chain -->
  <v-card v-if="data.resonanceChain" class="mt-4">
    <v-card-title tag="h2">
      {{ props.item.name }} {{ $t('characters.resonanceChain') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in data.resonanceChain"
          :key="index"
          cols="12"
          md="6"
        >
          <characters-resonance-chain-item :data="element" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Skills -->
  <v-card v-if="data.skills" class="mt-2">
    <v-card-title tag="h2">
      {{ props.item.name }} {{ $t('characters.skills') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in data.skills"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <characters-skill-item :data="element" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Ascension Material -->
  <v-card v-if="data.ascensions" class="mt-4">
    <v-card-title tag="h2">
      {{ props.item.name }} {{ $t('common.ascensionMaterial') }}
    </v-card-title>
    <v-divider />

    <v-card-text
      v-for="(ascension, index) in data.ascensions.filter(
        (e) => e.cost.length > 0
      )"
      :key="index"
    >
      <v-row>
        <v-col cols="12" sm="3" md="2">
          <v-card
            class="d-flex align-center justify-center text-center text-h6 fill-height pa-2"
          >
            Lv. {{ ascension.minLevel }}
          </v-card>
        </v-col>

        <v-col
          v-for="(cost, j) in ascension.cost"
          :key="j"
          cols="4"
          sm="3"
          md="2"
        >
          <v-card
            :to="
              dictItems[cost.item]
                ? localePath(`/items/${dictItems[cost.item].slug}`)
                : `/items`
            "
          >
            <v-responsive :aspect-ratio="1">
              <v-img
                v-if="dictItems[cost.item]"
                :src="`/items/icons/${dictItems[cost.item].slug}.webp`"
                :alt="$t(dictItems[cost.item].name)"
                class="align-end h-100"
                cover
              />
            </v-responsive>
            <v-divider />

            <v-card-title class="text-center">
              x{{ formatNumber(cost.quantity) }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />

    <v-card-actions class="d-flex align-center justify-end">
      <v-btn
        :to="localePath(`/todo-list/create?type=character&slug=${item.slug}`)"
        :text="$t('Add to Todo list')"
        :append-icon="mdiPlus"
        :title="$t('Add to Todo list')"
        variant="outlined"
        rel="nofollow"
      />
    </v-card-actions>
  </v-card>

  <!-- Recommended Weapons -->
  <!--    <v-card class="mt-4">-->
  <!--      <v-card-title>-->
  <!--        {{ $t('Recommended Weapons') }}-->
  <!--      </v-card-title>-->
  <!--    </v-card>-->
</template>
