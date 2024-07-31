<script setup lang="ts">
// uses
const notification = useNotification();
</script>

<template>
  <client-only>
    <div class="float-notifications">
      <notification-item
        v-for="(element, index) in notification.floatItems"
        :key="index"
        :data="element"
        :width="350"
        :class="{ 'mt-2': index > 0 }"
      />
    </div>
  </client-only>
</template>
