<script setup lang="ts">
// define
const props = defineProps<{
  ratio?: number;
}>();

// uses
const windowSize = useWindowSize();

// states
const width = ref(0);
const height = ref(0);
const padding = ref(17);

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

  width.value = window.innerWidth;
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
    <slot :width :height />
  </div>
</template>
