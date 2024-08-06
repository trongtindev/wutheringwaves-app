<script setup lang="ts">
import type { ICharacterRCData } from '~/interfaces/character';

const props = defineProps<{
  index: number;
  data: ICharacterRCData;
}>();

// uses
const i18n = useI18n();

// computed
const descriptionLocalized = computed(() => {
  if (
    props.data.descriptionLocalized &&
    props.data.descriptionLocalized[i18n.locale.value]
  ) {
    return props.data.descriptionLocalized[i18n.locale.value];
  }
  return props.data.description;
});
</script>

<template>
  <v-card class="fill-height">
    <v-sheet class="pt-2">
      <v-list-item :title="$t(props.data.name)">
        <template #prepend>
          <v-avatar class="border rounded">
            <v-img
              :src="`/resonance_chain/icons/${props.data.slug}.webp`"
              :alt="props.data.name"
            >
              <v-sheet
                class="bg-info position-absolute bottom-0 right-0 pl-1 pr-1 rounded-ts"
              >
                {{ (props.index + 1).toString() }}
              </v-sheet>
            </v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </v-sheet>

    <v-card-text v-if="descriptionLocalized">
      <div
        :innerHTML="
          descriptionLocalized
            .replace(/\{(\d+)\}/g, (_, j) => props.data.params[j] || '')
            .replaceAll('\n', '<br/>')
        "
      />
    </v-card-text>
    <v-sheet
      v-else
      class="pb-2"
    />
  </v-card>
</template>
