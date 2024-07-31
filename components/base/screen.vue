<script setup lang="ts">
const height = ref(0);
</script>

<template>
  <slot :height="height" />
</template>
