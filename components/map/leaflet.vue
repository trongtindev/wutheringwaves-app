<script setup lang="ts">
import type * as L from 'leaflet';
import type { IMapMarker } from '~/interfaces/map';

// define
const props = defineProps<{
  marked: number[];
  markers: Map<number, IMapMarker>;
  exclude: number[];
  compass?: number[];
  cluster?: boolean;
  options: L.MapOptions;
}>();

const emits = defineEmits<{
  (e: 'on-initialized', instance: L.Map): void;
  (e: 'on-drag', latLng: number[]): void;
  (e: 'on-zoom', level: number);
  (e: 'on-pressed-marker', latLng: number[]): void;
  (e: 'on-click', latLng: number[], markers: { id: number } & IMapMarker[]);
}>();

// states
const zoom = ref(props.options.zoom ?? 1);
const center = ref([0, 0]);
const active = shallowRef<{ id: number; marker: L.Marker }>();
const map = shallowRef<L.Map>(null as any);
const container = ref();
const popupElement = ref();
const addedMarkers = new Map<number, L.Marker>();
const clusterGroups = new Map<string, L.MarkerClusterGroup>();
let popup: L.Popup;

// functions
const initialize = async () => {
  console.log('leaflet', 'initialize');

  if (!container.value) {
    setTimeout(initialize, 25);
    return;
  }
  if (!popupElement.value) {
    setTimeout(initialize, 25);
    return;
  }
  if (!window.leaflet) {
    setTimeout(initialize, 25);
    return;
  }

  // create map
  map.value = window.leaflet.map(container.value, props.options);
  map.value.invalidateSize();

  // create popup
  popup = window.leaflet.popup({
    content: popupElement.value,
    keepInView: false,
    minWidth: 360,
    maxWidth: 360,
    closeButton: false,
  });

  map.value.on('click', (e) => {
    console.log([e.latlng.lat, e.latlng.lng]);
  });

  map.value.on('zoom', () => {
    if (!map.value) return;
    zoom.value = map.value.getZoom();
    console.debug('leaflet', 'zoom', zoom.value);
    emits('on-zoom', zoom.value);
  });

  map.value.on('drag', () => {
    if (!map.value) return;
    const latLng = map.value.getCenter();
    center.value = [latLng.lat, latLng.lng];
    emits('on-drag', [latLng.lat, latLng.lng]);
  });

  // render markers
  if (props.markers) renderMarker();

  // emits initialized
  emits('on-initialized', map.value);
};

const renderMarker = async () => {
  console.log('renderMarker', { cluster: props.cluster }, props.markers.keys());

  if (props.cluster) {
    // remove from normal
    for (const [key, marker] of addedMarkers) {
      marker.removeFrom(map.value);
      addedMarkers.delete(key);
    }

    for (const [_, { type }] of props.markers) {
      if (clusterGroups.has(type)) {
        continue;
      }
      const cluster = window.leaflet.markerClusterGroup({
        iconCreateFunction: (cluster) => {
          const childMarkers = cluster.getAllChildMarkers();
          const childCount = childMarkers.length;
          const firstChild = cluster.getAllChildMarkers()[0];
          const tooltip = cluster.getTooltip();
          if (tooltip) {
            tooltip.setTooltipContent(`${childCount}`);
          } else {
            cluster.bindTooltip(`${childCount}`, {
              permanent: true,
              direction: 'top',
            });
          }
          cluster.setIcon(firstChild.getIcon());
          return cluster.getIcon();
        },
      });

      cluster.addTo(map.value);
      clusterGroups.set(type, cluster);
    }

    for (const [group, cluster] of clusterGroups) {
      const addedLayers: L.Marker[] = [];

      const exists = [...props.markers.entries()].find(([_, { type }]) => {
        return group === type;
      });
      if (!exists) cluster.clearLayers();

      for (const [key, { type, marker }] of props.markers) {
        const marked = props.marked.includes(key);
        marker.setOpacity(marked ? 0.25 : 1);

        if (group !== type) {
          continue;
        }

        addedLayers.push(marker);
        marker.bindPopup(popup);
        marker.on('popupopen', () => onPressedMarker(key, marker));
      }
      cluster.addLayers(addedLayers);
    }
  } else {
    // remove from cluster
    for (const [_, cluster] of clusterGroups) {
      cluster.clearLayers();
    }

    // removing
    const removedMarker: L.Marker[] = [];
    for (const [key, marker] of addedMarkers) {
      if (props.markers.has(key)) {
        continue;
      }

      removedMarker.push(marker);
      marker.removeFrom(map.value);
      addedMarkers.delete(key);
    }

    // adding
    for (const [key, { marker }] of props.markers) {
      const marked = props.marked.includes(key);
      marker.setOpacity(marked ? 0.25 : 1);

      if (addedMarkers.has(key)) {
        continue;
      }
      addedMarkers.set(key, marker);
      marker.addTo(map.value);
      marker.bindPopup(popup);
      marker.on('popupopen', () => onPressedMarker(key, marker));
    }
  }
};

// events
const onPressedMarker = (id: number, marker: L.Marker) => {
  console.log('onPressedMarker', id);
  active.value = { id, marker };
};

// changes
watch(() => props.markers, renderMarker);
watch(() => props.cluster, renderMarker);

// lifecycle
onNuxtReady(() => {
  useLoadJS()
    .load([
      {
        src: import.meta.dev
          ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
          : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
        ensure: () => typeof window.leaflet != 'undefined',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js',
        ensure: () => typeof window.leaflet.MarkerClusterGroup != 'undefined',
      },
    ])
    .then(() => initialize());
});
onBeforeUnmount(() => map.value?.remove());

// head
useHead({
  link: [
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
      rel: 'stylesheet',
      integrity:
        'sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
    },
  ],
});
</script>

<template>
  <div ref="container" class="w-100 h-100">
    <div ref="popupElement">
      <slot :active="active" name="popup" />
    </div>
  </div>
</template>
