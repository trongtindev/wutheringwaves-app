<script setup lang="ts">
import type { ISnackbar } from '@/interfaces/snackbar';

// uses
const snackbar = useSnackbar();

// states
const show = ref(false);
const item = ref<ISnackbar>();

// changes
watch(show, (value) => {
  if (!value) {
    // remove first
    snackbar.queues.splice(0, 1);

    // if remaining
    if (snackbar.queues.length > 0) {
      item.value = snackbar.queues[0];
    }
  }
});

watch(
  () => snackbar.isCreated,
  () => {
    item.value = snackbar.queues[0];
    show.value = true;
  }
);

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 1000);
});
</script>

<template>
  <v-snackbar
    v-if="item"
    :key="item._id"
    v-model="show"
    :text="item.content"
    :color="item.color"
    :type="item.type"
    :timeout="item.timeout || 3000"
  />
</template>
