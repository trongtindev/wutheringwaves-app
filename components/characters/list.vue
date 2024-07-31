<script setup lang="ts">
import type { ICharacter } from '~/interfaces/character';

const props = defineProps<{
  items: ICharacter[];
}>();
</script>

<template>
  <v-row>
    <v-col
      v-for="(element, index) in props.items"
      :key="index"
      cols="6"
      sm="4"
      md="3"
      lg="2"
    >
      <character-card :item="element" />
    </v-col>
  </v-row>
</template>
