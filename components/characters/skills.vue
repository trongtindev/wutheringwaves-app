<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

const activeSkills = props.data.skills.filter((e) => {
  return (
    e.type === 'Basic Attack' ||
    e.type === 'Resonance Skill' ||
    e.type === 'Resonance Liberation'
  );
});

const passiveSkills = props.data.skills.filter((e) => {
  return e.type === 'Forte Circuit' || e.type === 'Inherent Skill';
});

const concertoSkills = props.data.skills.filter((e) => {
  return e.type === 'Intro Skill' || e.type === 'Outro Skill';
});

// states
const tab = ref(0);
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.skills') }}
    </template>

    <template #append>
      <v-tabs
        v-model="tab"
        :grow="true"
        :selected-class="`text-${item.attribute.slug}`"
      >
        <v-tab :value="0" :text="$t('characters.activeSkills')" />
        <v-tab :value="1" :text="$t('characters.passiveSkills')" />
        <v-tab :value="2" :text="$t('characters.concertoSkills')" />
      </v-tabs>
    </template>

    <v-window v-model="tab">
      <v-window-item :value="0">
        <masonry v-if="activeSkills.length > 0">
          <characters-skill-item
            v-for="(element, index) in activeSkills"
            :key="index"
            :data="element"
          />
        </masonry>
        <v-alert v-else :text="$t('common.upcoming')" />
      </v-window-item>

      <v-window-item :value="1">
        <masonry v-if="passiveSkills.length > 0">
          <characters-skill-item
            v-for="(element, index) in passiveSkills"
            :key="index"
            :data="element"
          />
        </masonry>
        <v-alert v-else :text="$t('common.upcoming')" />
      </v-window-item>

      <v-window-item :value="2">
        <masonry v-if="concertoSkills.length > 0">
          <characters-skill-item
            v-for="(element, index) in concertoSkills"
            :key="index"
            :data="element"
          />
        </masonry>
        <v-alert v-else :text="$t('common.upcoming')" />
      </v-window-item>
    </v-window>
  </characters-section>
</template>
