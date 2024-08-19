<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  echoes: IEcho[];
}>();
const bestEchoStats = props.data.bestEchoStats || [];
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.bestEchoStats') }}
    </template>

    <div v-if="props.data.bestEchoStats">
      <div
        v-for="(element, index) in bestEchoStats"
        :key="index"
        :class="{ 'mt-2': index > 0 }"
      >
        <v-row>
          <v-col v-for="(subElement, j) in element.items" :key="j">
            <v-card class="fill-height border">
              <v-card-title>
                {{ subElement.cost }} {{ $t('common.cost') }}
              </v-card-title>
              <v-card-text class="d-flex ga-2">
                <v-chip v-for="(e, k) in subElement.stats" :key="k" :text="e" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-alert v-else :text="$t('common.upcoming')" />
  </characters-section>
</template>
