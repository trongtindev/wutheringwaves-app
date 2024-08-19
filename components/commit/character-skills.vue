<script setup lang="ts">
import type { ICharacterSkillData } from '~/interfaces/character';
import type { ILocalized } from '~/interfaces/common';

const props = defineProps<{
  data: ICharacterSkillData;
  index: number;
}>();

const emits = defineEmits<{
  (e: 'on-changed', value: ICharacterSkillData);
}>();

// states
const nameLocalized = ref({
  en: props.data.name,
  ...(props.data.nameLocalized || {}),
} as ILocalized);

const descriptionLocalized = ref({
  en: props.data.description,
  ...(props.data.descriptionLocalized || {}),
} as ILocalized);

// functions
const emitChanged = () => {
  emits('on-changed', {
    ...props.data,
    name: nameLocalized.value['en'],
    nameLocalized: nameLocalized.value,
    descriptionLocalized: descriptionLocalized.value,
  });
};
</script>

<template>
  <div>
    <commit-localized-field
      v-model="nameLocalized"
      :title="`${props.data.name} - ${$t('common.name')}`"
      :localized="nameLocalized"
      :class="{ 'mt-2': index > 0 }"
      @on-changed="() => emitChanged()"
    />
    <commit-localized-field
      v-model="descriptionLocalized"
      :title="`${props.data.name} - ${$t('common.description')}`"
      :localized="descriptionLocalized"
      @on-changed="() => emitChanged()"
    />
  </div>
</template>
