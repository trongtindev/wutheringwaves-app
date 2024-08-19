<script setup lang="ts">
import type { ICharacter } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  characters: ICharacter[];
}>();

const moreBuildGuides = (() => {
  return props.characters.filter((e) => {
    return e.attribute && e.attribute == props.item.attribute && !e.hidden;
  });
})();
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.moreBuildGuides') }}
    </template>

    <v-row>
      <v-col
        v-for="(element, index) in moreBuildGuides"
        :key="index"
        cols="6"
        sm="4"
        md="2"
      >
        <character-card
          :item="element"
          :custom-name="`${element.name} Build`"
        />
      </v-col>
    </v-row>
  </characters-section>
</template>
