<script setup lang="ts">
const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();
</script>

<template>
  <div>
    <v-card-text>
      {{ $t('desktopApp.introduce') }}
    </v-card-text>
  </div>
</template>
