<script setup lang="ts">
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: IWeapon;
  ownedCount?: number;
}>();

const localePath = useLocalePath();
</script>

<template>
  <v-card :to="localePath(`/weapons/${props.item.slug}`)">
    <v-img
      :aspect-ratio="1"
      :src="`/weapons/icons/${props.item.slug}.webp`"
      :cover="true"
      class="align-end h-100"
    >
      <v-sheet class="position-absolute top-0 left-0 pl-2 pt-2">
        <client-only>
          <v-tooltip location="bottom">
            <template #activator="tooltip">
              <v-chip
                v-if="props.ownedCount"
                v-bind="tooltip.props"
                :text="props.ownedCount.toString()"
                color="info"
              />
            </template>

            <div>
              {{ $t('weapons.ownedTooltip') }}
            </div>
          </v-tooltip>
        </client-only>
      </v-sheet>
    </v-img>

    <v-card-title
      tag="h2"
      class="text-center"
      :class="`text-rarity${props.item.rarity}`"
    >
      {{ $t(props.item.name) }}
    </v-card-title>
  </v-card>
</template>
