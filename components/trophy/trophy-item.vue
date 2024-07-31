<script lang="ts" setup>
import { mdiChevronRight } from '@mdi/js';
import type { ITrophy } from '~/interfaces/trophy';

// define
const props = defineProps<{
  data: ITrophy;
  disabled?: boolean | undefined;
  checkedItems: string[];
}>();

const emits = defineEmits<{
  (e: 'on-checked', value: boolean);
}>();

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// states
const checked = ref<boolean>();

// computed
const nameLocalized = computed(() => {
  return i18n.t(props.data.name);
});

const descriptionLocalized = computed(() => {
  return i18n.t(props.data.description);
});

// changes
watch(
  () => checked.value,
  (newValue, oldValue) => {
    if (typeof newValue != 'undefined' && typeof oldValue != 'undefined') {
      emits('on-checked', newValue);
    }
  },
);

watch(
  () => props.checkedItems,
  (value) => {
    checked.value = value.includes(props.data.slug);
  },
);
</script>

<template>
  <v-list-item
    :title="nameLocalized"
    :subtitle="descriptionLocalized"
    @click="() => (checked = !checked)"
  >
    <template #append>
      <v-chip
        v-if="props.data.hidden"
        :text="$t('common.hidden')"
        color="info"
      />

      <v-checkbox v-model="checked" :hide-details="true" />

      <v-btn
        variant="text"
        size="x-small"
        :icon="mdiChevronRight"
        :to="localePath(`/trophies/${props.data.slug}`)"
      />
    </template>
  </v-list-item>
</template>
