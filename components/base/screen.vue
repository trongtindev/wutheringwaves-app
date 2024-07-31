<script setup lang="ts">
// define
const props = defineProps<{
  ratio?: number;
}>();

// uses
const windowSize = useWindowSize();

// states
const height = ref(0);
const padding = ref(16);

// functions
const calculator = () => {
  const container = document.querySelector('.v-container');
  if (!container) {
    setTimeout(calculator, 50);
    return;
  }

  const toolbar = document.querySelector('.v-toolbar__content');
  if (!toolbar) {
    setTimeout(calculator, 50);
    return;
  }

  const windowHeight = window.innerHeight * (props.ratio || 1);
  height.value = windowHeight - toolbar.clientHeight - padding.value;
};

// changes
watch(windowSize.width, calculator);
watch(windowSize.height, calculator);

// lifecycle
onMounted(calculator);
</script>

<template>
  <div :style="`height: ${height}px`">
    <slot :height="height" />
  </div>
</template>
