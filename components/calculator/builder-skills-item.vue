<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';

const props = defineProps<{
  participant: number;
  item: ICalculatorParticipant;
}>();

const skills = computed(() => {
  if (props.item.character) {
    return (props.item.character.data.skills || []).filter((e) => {
      return !e.name.includes('Cook');
    });
  }
  return undefined;
});
</script>

<template>
  <div>
    <div v-if="!skills">
      <v-skeleton-loader
        v-for="index in 8"
        :key="index"
        :boilerplate="true"
        :class="{ 'mt-2': index > 1 }"
        type="list-item-avatar-two-line"
      />
    </div>

    <div>
      <calculator-builder-skill-item
        v-for="(element, index) in skills"
        :key="index"
        :participant
        :index
        :item="element"
        :class="{ 'mt-2': index > 0 }"
      />
    </div>
  </div>
</template>
