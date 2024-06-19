<script setup lang="ts">
// uses
const app = useApp();

// states
const hidden = useLocalStorage('userData.under-development-alert', true);

// events
const onPressedContribute = () => window.open(app.githubRepo);

// lifecycle
onMounted(() => {});
</script>

<template>
  <v-alert
    v-model="hidden"
    color="warning"
    class="cursor-pointer mb-4"
    :text="$t('other.underDevelopment')"
    :closable="true"
    @click="onPressedContribute"
  />
</template>
