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
    <v-responsive
      :aspect-ratio="1"
      :style="`background-color: var(--color-background-rarity${props.item.rarity});`"
    >
      <v-img
        :src="`/characters/icons/${props.item.slug}.webp`"
        :alt="nameLocalized"
        class="align-end h-100"
        cover
      >
        <v-sheet
          style="left: 5px; top: 5px"
          class="pa-1 d-flex op-90 align-center rounded-xl position-absolute"
        >
          <v-img
            v-if="props.item.attribute"
            class="bg-grey-darken-3 rounded-circle"
            :width="18"
            :height="18"
            :src="`/attributes/icons/${props.item.attribute.toLowerCase()}.png`"
            :alt="props.item.attribute"
          />
          <v-sheet
            v-else
            :width="18"
            class="bg-grey-darken-3 rounded-circle"
            :height="18"
          />

          <span
            v-if="props.sequences"
            class="font-weight-bold ml-1 pr-1"
            :class="props.sequences > 6 ? 'text-red' : 'text-green'"
          >
            S{{ props.sequences }}
          </span>

          <span v-if="props.item.upcoming" class="font-weight-bold ml-1 pr-1">
            {{ $t('common.upcoming') }}
          </span>
        </v-sheet>
      </v-img>
    </v-responsive>
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
