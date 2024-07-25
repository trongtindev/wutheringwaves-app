<script setup lang="ts">
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: IWeapon;
}>();

const localePath = useLocalePath();
</script>

<template>
  <v-card :to="localePath(`/weapons/${props.item.slug}`)">
    <v-img
      :aspect-ratio="1"
      :src="`/weapons/icons/${props.item.slug}.webp`"
      :cover="true"
      class="align-end h-100"
    />

    <v-card-title
      tag="h2"
      class="text-center"
      :class="`text-rarity${props.item.rarity}`"
    >
      {{ $t(props.item.name) }}
    </v-card-title>
  </v-card>
</template>
