<script setup lang="ts">
import type { IBannerSummaryListItem } from '~/interfaces/convene';

const props = defineProps<{
  data: IBannerSummaryListItem & { icon: string };
  rarity: number;
}>();
</script>

<template>
  <div>
    <v-list-item>
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
    <v-progress-linear :model-value="props.data.percentage" class="mt-2" />
  </div>
</template>
