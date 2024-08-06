<script setup lang="ts">
// define
const props = defineProps<{
  data: any;
  index: number;
}>();

// computed
const imageUrl = computed(() => {
  const path = props.data.resourceType == 'Weapon' ? 'weapons' : 'characters';
  return `/${path}/icons/${props.data.slug}.webp`;
});
</script>

<template>
  <div
    :style="
      index > 6
        ? `left: ${80 * (index - 7) + 20 * (index - 7) + 20}px; bottom: 140px`
        : `left: ${80 * index + 20 * index + 20}px; bottom: 40px`
    "
    :class="
      props.data.rarity > 0 ? `border-rarity${props.data.rarity}` : 'border'
    "
    style="width: 80px; height: 80px"
    cols="2"
    class="rounded-circle position-absolute"
  >
    <v-badge
      :content="props.data.chain"
      class="w-100 h-100"
    >
      <v-img
        v-if="props.data.slug"
        :src="imageUrl"
        class="w-100 h-100 rounded-circle"
      />
    </v-badge>
  </div>
</template>
