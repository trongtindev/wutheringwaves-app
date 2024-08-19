<script setup lang="ts">
import type { ICharacterSkillData } from '~/interfaces/character';

const props = defineProps<{
  skills: ICharacterSkillData[];
}>();

const emits = defineEmits<{
  (e: 'on-click', value: ICharacterSkillData);
}>();

// computed
const displaySkills = computed(() => {
  return props.skills.filter((e) => {
    return (
      e.type !== 'Intro Skill' &&
      e.type !== 'Outro Skill' &&
      !e.name.includes('Cook')
    );
  });
});
</script>

<template>
  <div>
    <v-list-item
      v-for="(skill, j) in displaySkills"
      :key="j"
      :title="skill.name"
      :subtitle="skill.type"
      class="ml-12"
      @click="() => emits('on-click', skill)"
    >
      <template #prepend>
        <v-avatar :image="skill.icon" class="border" rounded />
      </template>
    </v-list-item>
  </div>
</template>
