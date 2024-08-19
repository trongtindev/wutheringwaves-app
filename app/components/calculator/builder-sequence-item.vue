<script setup lang="ts">
import type { ICharacterRCData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacterRCData;
  disabled: boolean;
}>();

// uses
const { locale } = useI18n();

// computed
const descriptionLocalized = computed(() => {
  if (
    props.item.descriptionLocalized &&
    props.item.descriptionLocalized[locale.value]
  ) {
    return props.item.descriptionLocalized[locale.value];
  }
  return props.item.description;
});
</script>

<template>
  <v-expansion-panel :disabled="props.disabled">
    <v-expansion-panel-title>
      {{ item.name }}
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div
        :innerHTML="
          descriptionLocalized
            .replace(/\{(\d+)\}/g, (_, j) => item.params[j] || '')
            .replaceAll('\n', '<br/>')
        "
      ></div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
