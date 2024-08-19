<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

// computed
const voiceActors = computed(() => {
  return props.data.voiceActors;
});
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.voiceActors') }}
    </template>

    <v-alert v-if="voiceActors.length == 0" :text="$t('common.upcoming')" />
    <div v-else class="mt-2">
      <v-row>
        <v-col
          v-for="(element, index) in voiceActors"
          :key="index"
          cols="6"
          md="3"
          lg="2"
        >
          <v-card>
            <v-img :aspect-ratio="1">
              <div class="position-absolute top-0 right-0 pr-2 mt-2">
                <v-chip :text="element.locale" />
              </div>
            </v-img>

            <v-card-title class="text-body-1 text-center">
              {{ element.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </characters-section>
</template>
