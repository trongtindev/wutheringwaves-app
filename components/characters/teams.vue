<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  nameLocalized: string;
}>();

// uses
const localePath = useLocalePath();
const resources = useResources();

// fetch
const characters = await resources.getCharacters();
const characterDict = Object.fromEntries(characters.map((e) => [e.slug, e]));

// computed
const nameLocalized = computed(() => {
  return props.item.name;
});

const bestTeams = computed(() => {
  if (!props.data.bestTeams) return [];
  return props.data.bestTeams;
});
</script>

<template>
  <!-- Suggested Echos -->
  <v-card class="mt-2">
    <v-card-title tag="h2">
      {{ $t('characters.bestTeams', { name: nameLocalized }) }}
    </v-card-title>
    <v-divider />

    <v-card-text v-if="props.data.bestTeams">
      <v-sheet
        v-for="(element, index) in bestTeams"
        :key="index"
        class="d-flex flex-wrap ga-2 justify-center"
      >
        <v-sheet
          v-for="(subElement, j) in element.items"
          :key="j"
          class="d-flex justify-center ga-2"
        >
          <v-sheet class="border rounded pa-2">
            <v-sheet class="text-center mb-2">
              <v-chip v-if="j == 0">Main DPS</v-chip>
              <v-chip v-else-if="j == 1">Sub DPS</v-chip>
              <v-chip v-else>Healer</v-chip>
            </v-sheet>

            <v-sheet class="d-flex flex-wrap justify-center ga-2">
              <v-sheet
                v-for="(slug, k) in subElement.items"
                :key="k"
                :width="160"
              >
                <character-card :item="characterDict[slug]" />
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <!-- <v-table class="border rounded">
        <thead>
          <tr>
            <td class="text-center">Main DPS</td>
            <td class="text-center">Sub DPS</td>
            <td class="text-center">Healer</td>
          </tr>
        </thead>
      </v-table> -->
    </v-card-text>

    <v-card-text v-else>
      {{ $t('common.upcoming') }}
    </v-card-text>
  </v-card>
</template>
