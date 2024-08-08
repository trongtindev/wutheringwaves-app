<script setup lang="ts">
import type { ICharacterSkillData } from '~/interfaces/character';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
const props = defineProps<{
  participant: number;
  index: number;
  item: ICharacterSkillData;
}>();

// uses
const { t, locale } = useI18n();

// states
const level = ref();
const detailed = ref(false);

// computed
const nameLocalized = computed(() => {
  return props.item.nameLocalized[locale.value] || props.item.name;
});

const descriptionLocalized = computed(() => {
  return (
    props.item.descriptionLocalized[locale.value] ||
    props.item.description ||
    t('common.none')
  ).replaceAll('\n', '<br/>');
});
</script>

<template>
  <v-card>
    <v-list-item class="mt-2">
      <template #prepend>
        <v-avatar class="border" :image="item.icon" rounded />
      </template>

      <v-list-item-title>
        {{ nameLocalized }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ props.item.type }}
      </v-list-item-subtitle>

      <template #append>
        <v-btn
          :icon="detailed ? mdiChevronUp : mdiChevronDown"
          size="small"
          @click="() => (detailed = !detailed)"
        />
      </template>
    </v-list-item>

    <v-card-text>
      <div
        v-show="detailed"
        :innerHTML="descriptionLocalized"
        class="mb-2"
      ></div>

      <v-slider
        v-model="level"
        :label="$t('common.level')"
        :min="1"
        :step="1"
        thumb-label
        hide-details
      />
    </v-card-text>
  </v-card>
</template>
