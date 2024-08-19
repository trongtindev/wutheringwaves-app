<script setup lang="ts">
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: IWeapon;
  obtainedCount?: number;
}>();

// uses
const { locale } = useI18n();
const localePath = useLocalePath();

// statics
const nameLocalized = props.item.nameLocalized[locale.value] || props.item.name;
</script>

<template>
  <v-card :to="localePath(`/weapons/${props.item.slug}`)">
    <v-img
      :aspect-ratio="1"
      :src="`/weapons/icons/${props.item.slug}.webp`"
      :cover="true"
      :alt="nameLocalized"
      class="align-end h-100"
    >
      <v-sheet class="position-absolute top-0 left-0 pl-2 pt-2">
        <client-only>
          <v-tooltip location="bottom">
            <template #activator="tooltip">
              <v-chip
                v-if="props.obtainedCount"
                v-bind="tooltip.props"
                :text="props.obtainedCount.toString()"
                color="info"
              />
            </template>

            <div>
              {{ $t('weapons.obtainedTooltip') }}
            </div>
          </v-tooltip>
        </client-only>
      </v-sheet>
    </v-img>

    <v-card-title
      :class="`text-rarity${props.item.rarity}`"
      tag="h2"
      class="text-center"
    >
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
