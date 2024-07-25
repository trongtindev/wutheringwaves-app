<script setup lang="ts">
import type { ICharacter } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  sequences?: number;
  customName?: string;
}>();

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// computed
const nameLocalized = computed(() => {
  return props.customName || i18n.t(props.item.name);
});
</script>

<template>
  <v-card :to="localePath(`/characters/${props.item.slug}`)">
    <v-img
      :aspect-ratio="1"
      :src="`/characters/icons/${props.item.slug}.webp`"
      :alt="item.name"
      class="align-end h-100"
      cover
    >
      <v-chip
        style="left: 5px; top: 5px"
        class="pa-1 d-flex align-center position-absolute rounded-xl"
      >
        <v-img
          v-if="props.item.attribute"
          class="bg-grey-darken-3 rounded-circle"
          :width="16"
          :height="16"
          :src="`/attributes/icons/${props.item.attribute.toLowerCase()}.png`"
          :alt="props.item.attribute"
        />
        <v-sheet
          v-else
          :width="16"
          :height="16"
          class="bg-grey-darken-3 rounded-circle"
        />

        <span
          v-if="props.sequences"
          class="font-weight-bold ml-1 pr-1"
          :style="`color: hsl(${100 - (props.sequences / 7) * 100}, 100%, 50%);`"
        >
          S{{ props.sequences }}
        </span>

        <span v-if="props.item.upcoming" class="font-weight-bold ml-1 pr-1">
          {{ $t('common.upcoming') }}
        </span>
      </v-chip>
    </v-img>
    <v-divider />

    <v-card-title
      tag="h2"
      class="text-center"
      :class="`text-rarity${props.item.rarity}`"
    >
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
