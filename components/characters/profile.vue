<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();
</script>

<template>
  <!-- Resonance Chain -->
  <v-card v-if="data.resonanceChain" class="mt-2">
    <v-card-title tag="h2">
      {{ props.item.name }} {{ $t('characters.resonanceChain') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in data.resonanceChain"
          :key="index"
          cols="12"
          md="6"
        >
          <characters-resonance-chain-item :data="element" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Skills -->
  <v-card v-if="data.skills" class="mt-2">
    <v-card-title tag="h2">
      {{ props.item.name }} {{ $t('characters.skills') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in data.skills"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <characters-skill-item :data="element" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
