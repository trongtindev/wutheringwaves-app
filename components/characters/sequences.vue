<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.resonanceChain') }}
    </template>

    <div v-if="data.resonanceChain.length > 0">
      <v-row>
        <v-col
          v-for="(element, index) in data.resonanceChain"
          :key="index"
          cols="12"
          md="6"
        >
          <characters-sequence-item :index :data="element" />
        </v-col>
      </v-row>
    </div>
    <v-alert v-else :text="$t('common.upcoming')" />
  </characters-section>
</template>
