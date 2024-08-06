<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();
</script>

<template>
  <!-- Resonance Chain -->
  <div class="mt-2">
    <h2 class="text-h6 mb-2">
      {{ props.item.name }} {{ $t('characters.resonanceChain') }}
    </h2>

    <div v-if="data.resonanceChain">
      <v-row>
        <v-col
          v-for="(element, index) in data.resonanceChain"
          :key="index"
          cols="12"
          md="6"
        >
          <characters-resonance-chain-item :index :data="element" />
        </v-col>
      </v-row>
    </div>
    <v-alert v-else :text="$t('common.upcoming')" />
  </div>

  <!-- Skills -->
  <div class="mt-2">
    <h2 class="text-h6 mb-2">
      {{ props.item.name }} {{ $t('characters.skills') }}
    </h2>

    <masonry v-if="data.skills">
      <characters-skill-item
        v-for="(element, index) in data.skills"
        :key="index"
        :data="element"
      />
    </masonry>
    <v-alert v-else :text="$t('common.upcoming')" />
  </div>
</template>
