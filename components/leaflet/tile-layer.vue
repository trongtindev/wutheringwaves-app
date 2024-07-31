<script setup lang="ts">
import type { Map, TileLayer, TileLayerOptions } from 'leaflet';

// define
const props = defineProps<{
  leaflet: Map;
  urlTemplate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: (TileLayerOptions & { [key: string]: any }) | undefined;
}>();

// states
const instance = ref<TileLayer>();

// functions
const initialize = async () => {
  const { TileLayer } = window.leaflet;
  instance.value = new TileLayer(props.urlTemplate, props.options);
  props.leaflet.addLayer(instance.value);
};

// lifecycle
onMounted(initialize);
onUnmounted(() => {
  if (instance.value) {
    props.leaflet.removeLayer(instance.value);
    instance.value.remove();
  }
});
</script>

<template>
  <div></div>
</template>
