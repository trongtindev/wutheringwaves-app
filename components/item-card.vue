<script setup lang="ts">
import type { IItem } from '~/interfaces/item';

// define
defineProps<{
  item: IItem;
}>();

// uses
const localePath = useLocalePath();
</script>

<template>
  <v-card :to="localePath(`/items/${item.slug}`)" :title.attr="item.name">
    <v-responsive
      :aspect-ratio="1 / 1"
      :style="`background-color: var(${item.rarity === 4 ? '--rarity-purple' : '--rarity-yellow'});`"
    >
      <v-img
        :src="`/items/icons/${item.slug}.webp`"
        :alt="$t(item.name)"
        class="align-end h-100"
        cover
      />
    </v-responsive>

    <v-card-title class="text-center" tag="h2">
      {{ $t(item.name) }}
    </v-card-title>
  </v-card>
</template>
