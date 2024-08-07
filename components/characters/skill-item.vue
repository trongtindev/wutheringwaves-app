<script lang="ts" setup>
import type { ICharacterSkillData } from '~/interfaces/character';

// define
const props = defineProps<{
  data: ICharacterSkillData;
}>();

// uses
const i18n = useI18n();

// computed
const nameLocalized = (() => {
  if (props.data.nameLocalized && props.data.nameLocalized[i18n.locale.value]) {
    return props.data.nameLocalized[i18n.locale.value];
  }
  return props.data.name;
})();

const descriptionLocalized = (() => {
  if (
    props.data.descriptionLocalized &&
    props.data.descriptionLocalized[i18n.locale.value]
  ) {
    return props.data.descriptionLocalized[i18n.locale.value];
  }
  return props.data.description;
})();
</script>

<template>
  <v-card>
    <v-sheet class="pt-2">
      <v-list-item :title="$t(nameLocalized)" :subtitle="$t(props.data.type)">
        <template #prepend>
          <v-avatar class="border rounded">
            <v-img
              :src="`/skills/icons/${props.data.slug}.webp`"
              :alt="nameLocalized"
            />
          </v-avatar>
        </template>
      </v-list-item>
    </v-sheet>

    <v-card-text v-if="descriptionLocalized">
      <div :innerHTML="descriptionLocalized.replaceAll('\n', '<br/>')" />
    </v-card-text>
    <v-sheet v-else class="pb-2" />
  </v-card>
</template>
