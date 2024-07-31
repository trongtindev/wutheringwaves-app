<script lang="ts" setup>
import type { ITrophy } from '~/interfaces/trophy';

// define
const props = defineProps<{
  data: ITrophy;
  checkedItems: string[];
  items: ITrophy[];
}>();

const emits = defineEmits<{
  (e: 'on-checked', slug: string, value: boolean);
}>();
</script>

<template>
  <v-card>
    <trophy-item
      :data="props.data"
      :checked-items="props.checkedItems"
      @on-checked="(val) => emits('on-checked', props.data.slug, val)"
    />
    <trophy-item
      v-for="(element, index) in items"
      :key="index"
      :data="element"
      :checked-items="props.checkedItems"
      @on-checked="(val) => emits('on-checked', element.slug, val)"
    />
  </v-card>
</template>
