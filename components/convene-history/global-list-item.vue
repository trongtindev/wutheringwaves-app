<script setup lang="ts">
import type { IBannerSummaryListItem } from '~/interfaces/convene';

const props = defineProps<{
  data: IBannerSummaryListItem & { icon: string };
  rarity: number;
}>();
</script>

<template>
  <v-list-item class="mt-1">
    <template #prepend>
      <v-avatar class="border" :image="props.data.icon" />
    </template>

    <v-list-item-title :class="`text-rarity${props.rarity}`">
      {{ props.data.item }}
    </v-list-item-title>

    <template #append>
      {{ formatNumber(props.data.total) }} ({{ props.data.percentage }}%)
    </template>
  </v-list-item>
  <div class="mt-2 mb-2 pl-2 pr-2">
    <v-progress-linear :model-value="props.data.percentage" />
  </div>
</template>
