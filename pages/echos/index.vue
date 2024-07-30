<script setup lang="ts">
const route = useRoute();
await navigateTo(route.path.replace('/echos', '/echoes'), {
  redirectCode: 301,
});
</script>

<template>
  <div></div>
</template>
