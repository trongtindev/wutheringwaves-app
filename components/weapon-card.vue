<script setup lang="ts">
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: IWeapon;
}>();

const localePath = useLocalePath();
</script>

<template>
  <v-card :to="localePath(`/weapons/${props.item.slug}`)">
    <v-responsive
      :aspect-ratio="1"
      :style="`background-color: var(--color-background-rarity${props.item.rarity});`"
    >
      <v-img
        class="align-end h-100"
        :src="`/weapons/icons/${props.item.slug}.webp`"
        :cover="true"
      />
    </v-responsive>
    <v-divider />

    <v-card-title
      tag="h2"
      class="text-center"
      :class="`text-rarity${props.item.rarity}`"
    >
      {{ $t(props.item.name) }}
    </v-card-title>
  </v-card>
</template>
