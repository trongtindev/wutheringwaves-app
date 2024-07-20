<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

// uses
const resources = useResources();

// fetch
const echos = await resources.getEchos();

// computed
const nameLocalized = computed(() => {
  return props.item.name;
});

const suggestedEchos = computed(() => {
  return echos.filter((e) => {
    return (
      e.suggestedCharacters && e.suggestedCharacters.includes(props.item.slug)
    );
  });
});
</script>

<template>
  <!-- Suggested Echos -->
  <v-card class="mt-2">
    <v-card-title tag="h2">
      {{ $t('characters.suggestedEchos', { name: nameLocalized }) }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in suggestedEchos"
          :key="index"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <echo-card :item="element" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
