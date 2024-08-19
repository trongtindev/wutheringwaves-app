<script setup lang="ts">
import type { IItem } from '~/interfaces/item';

// define
const props = defineProps<{
  item: IItem;
}>();

// uses
const { locale } = useI18n();
const localePath = useLocalePath();

// statics
const nameLocalized = (() => {
  return props.item.nameLocalized[locale.value] || props.item.name;
})();
</script>

<template>
  <v-card :to="localePath(`/items/${item.slug}`)">
    <v-img
      :aspect-ratio="1 / 1"
      :src="`/items/icons/${item.slug}.webp`"
      :alt="nameLocalized"
      cover
    />

    <v-card-title
      :class="`text-rarity${item.rarity}`"
      class="text-center"
      tag="h2"
    >
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
