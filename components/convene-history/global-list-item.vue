<script setup lang="ts">
import type { IBannerSummaryListItem } from '~/interfaces/convene';

const props = defineProps<{
  data: IBannerSummaryListItem & { icon: string };
  rarity: number;
}>();
</script>

<template>
  <tr>
    <td>
      <v-avatar class="border" :image="props.data.icon" />
    </td>

    <td :class="`text-rarity${props.rarity}`">
      {{ props.data.item }}
    </td>

    <td>
      {{ formatNumber(props.data.total) }}
    </td>

    <td>{{ props.data.percentage }}%</td>
  </tr>
</template>
