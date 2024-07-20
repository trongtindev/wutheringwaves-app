<script setup lang="ts">
import type { ICharacter } from '~/interfaces/character';

const props = defineProps<{
  data: ICharacter;
  owned?: any;
  customName?: string;
}>();

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// computed
const nameLocalized = computed(() => {
  return props.customName || i18n.t(props.data.name);
});
</script>

<template>
  <v-card
    :to="localePath(`/characters/${props.data.slug}`)"
    :title.attr="nameLocalized"
  >
    <v-responsive
      :aspect-ratio="1"
      :style="`background-color: var(--color-background-rarity${props.data.rarity});`"
    >
      <v-img
        :src="`/characters/icons/${props.data.slug}.webp`"
        :alt="nameLocalized"
        class="align-end h-100"
        cover
      >
        <v-sheet
          style="left: 5px; top: 5px; position: absolute"
          class="pa-1 d-flex op-90 align-center rounded-xl"
        >
          <v-img
            v-if="props.data.attribute"
            class="bg-grey-darken-3 rounded-circle"
            :width="18"
            :height="18"
            :src="`/attributes/icons/${props.data.attribute.toLowerCase()}.png`"
            :alt="props.data.attribute"
          />
          <v-sheet
            v-else
            :width="18"
            class="bg-grey-darken-3 rounded-circle"
            :height="18"
          />

          <span
            v-if="owned && owned[props.data.name]"
            class="font-weight-bold ml-1 pr-1"
            :class="
              owned[props.data.name].resonanceChain > 6
                ? 'text-red'
                : 'text-green'
            "
          >
            S{{ owned[props.data.name].resonanceChain }}
          </span>

          <span v-if="props.data.upcoming" class="font-weight-bold ml-1 pr-1">
            {{ $t('common.upcoming') }}
          </span>
        </v-sheet>
      </v-img>
    </v-responsive>
    <v-divider />

    <v-card-title
      tag="h2"
      class="text-center"
      :class="`text-rarity${props.data.rarity}`"
    >
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
