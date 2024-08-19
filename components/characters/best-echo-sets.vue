<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  echoes: IEcho[];
}>();

const bestEchoSets = props.data.bestEchoSets || [];
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.bestEchoSets') }}
    </template>

    <div v-if="props.data.bestEchoSets">
      <v-card
        v-for="(element, index) in bestEchoSets"
        :key="index"
        :class="{ 'mt-2': index > 0 }"
        class="pt-1 pb-1"
      >
        <v-row>
          <v-col v-for="(subElement, j) in element.items" :key="j">
            <v-list-item>
              <template #prepend>
                <v-avatar rounded>
                  <v-img
                    :src="subElement.icon"
                    :style="`background: ${subElement.colors.background}; border: 3px solid ${subElement.colors.border};`"
                  />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ subElement.name }}
              </v-list-item-title>

              <template #append>
                <v-chip
                  :color="element.different >= 100 ? 'success' : undefined"
                >
                  {{ element.different }}%
                </v-chip>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-alert v-else :text="$t('common.upcoming')" />
  </characters-section>
</template>
