<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  echoes: IEcho[];
}>();

const bestMainEchoes = (() => {
  if (!props.data.bestMainEchoes) return [];
  return props.data.bestMainEchoes.map((e) => {
    return props.echoes.find((echo) => echo.slug == e)!;
  });
})();
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.bestMainEchoes') }}
    </template>

    <div v-if="props.data.bestMainEchoes">
      <v-row>
        <v-col
          v-for="(element, index) in bestMainEchoes"
          :key="index"
          cols="6"
          sm="4"
          md="2"
        >
          <echo-card :item="element" />
        </v-col>
      </v-row>
    </div>

    <v-alert v-else :text="$t('common.upcoming')" />
  </characters-section>
</template>
