<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

// uses
const resources = useResources();

// fetch
const characters = await resources.getCharacters({
  hidden: false,
  upcoming: false,
});
const characterDict = Object.fromEntries(characters.map((e) => [e.slug, e]));

// computed
const bestTeams = props.data.bestTeams || [];
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.bestTeams') }}
    </template>

    <div v-if="props.data.bestTeams">
      <div
        v-for="(element, index) in bestTeams"
        :key="index"
        class="d-flex flex-wrap ga-2"
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
      </div>
    </div>

    <v-alert v-else :text="$t('common.upcoming')" />
  </characters-section>
</template>
