<script setup lang="ts">
import type { ILocalized } from '~/interfaces/common';

const model = defineModel<ILocalized>();
const props = defineProps<{
  title: string;
  localized: ILocalized;
}>();
const emits = defineEmits<{
  (e: 'on-changed');
}>();

// uses
const { locales } = useI18n();
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      {{ props.title }}
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <v-textarea
        v-for="(locale, index) in locales"
        :key="index"
        v-model="model![locale.code]"
        :rows="1"
        :auto-grow="true"
        :label="locale.name"
        @keyup="() => emits('on-changed')"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
