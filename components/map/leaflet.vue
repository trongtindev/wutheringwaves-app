<script setup lang="ts">
import type { Map, MapOptions, Marker, MarkerClusterGroup } from 'leaflet';

// define
const props = defineProps<{
  compass?: number[];
  markers?: Marker[];
  options: MapOptions;
}>();

const emits = defineEmits<{
  (e: 'on-initialized', instance: Map): void;
  (e: 'on-drag', latLng: number[]): void;
  (e: 'on-zoom', level: number);
  (e: 'on-pressed-marker', latLng: number[]): void;
}>();

// states
const zoom = ref(props.options.zoom ?? 1);
const center = ref([0, 0]);
const leaflet = shallowRef<Map>();
const container = ref();
const markerClusterGroup = shallowRef<MarkerClusterGroup>();

// functions
const initialize = async () => {
  if (!container.value) {
    setTimeout(initialize, 25);
    return;
  }

  if (!window.leaflet) {
    setTimeout(initialize, 25);
    return;
  }

  const { map } = window.leaflet;
  leaflet.value = map(container.value, props.options);
  leaflet.value.invalidateSize();

  leaflet.value.on('click', (e) => {
    if (!leaflet.value) return;

    console.log('leaflet', 'click', [e.latlng.lat, e.latlng.lng]);
  });

  //   const distance = 1000 / Math.pow(2, zoom.value - baseZoomLevel.value);
  //   const markers = Object.keys(markerInstances.value)
  //     .sort((a, b) => {
  //       const markerLatLngA = markerInstances.value[a].getLatLng();
  //       const markerLatLngB = markerInstances.value[b].getLatLng();
  //       const distanceA = e.latlng.distanceTo(markerLatLngA);
  //       const distanceB = e.latlng.distanceTo(markerLatLngB);
  //       return distanceA - distanceB;
  //     })
  //     .filter((key) => {
  //       const markerLatLng = markerInstances.value[key].getLatLng();
  //       return e.latlng.distanceTo(markerLatLng) <= distance;
  //     });

  //   if (markers.length > 0) {
  //     selectedMarker.value = markerInstances.value[markers[0]].getLatLng();
  //   } else {
  //     selectedMarker.value = undefined;
  //   }
  // });
  leaflet.value.on('zoom', () => {
    if (!leaflet.value) return;
    zoom.value = leaflet.value.getZoom();
    emits('on-zoom', zoom.value);
  });

  leaflet.value.on('drag', () => {
    if (!leaflet.value) return;
    const latLng = leaflet.value.getCenter();
    center.value = [latLng.lat, latLng.lng];
    emits('on-drag', [latLng.lat, latLng.lng]);
  });

  emits('on-initialized', leaflet.value);
  // renderMarkerDebounce();
};

const renderMarker = async () => {
  // if (!leaflet.value) {
  //   renderMarkerDebounce();
  //   return;
  // }
  // const { marker, latLng, icon } = await import('leaflet');
  // const markers = (props.markers || [])
  //   .map((e) => {
  //     const latlng = latLng(e.latlng[0], e.latlng[1]);
  //     return {
  //       latLng: latlng,
  //       options: {
  //         icon: e.icon
  //           ? icon({
  //               iconUrl: e.icon,
  //               iconSize: [28, 28],
  //             })
  //           : undefined,
  //         title: e.title,
  //         opacity: e.opacity || 1,
  //       },
  //     };
  //   })
  //   .filter((e) => {
  //     return leaflet.value?.getBounds().contains(e.latLng);
  //   })
  //   .map((e, i) => {
  //     if (i > markerLimitCount.value) {
  //       renderMarkerLimitThrottle();
  //       return undefined;
  //     }
  //     const key = e.latLng.toString();
  //     if (markerInstances.value[key]) {
  //       const marker = markerInstances.value[key];
  //       if (
  //         e.options &&
  //         e.options.opacity &&
  //         marker.options.opacity != e.options.opacity
  //       ) {
  //         marker.setOpacity(e.options.opacity);
  //       }
  //       return marker;
  //     }
  //     return marker(e.latLng, e.options).addTo(leaflet.value!);
  //   })
  //   .filter((e) => typeof e != 'undefined');
  // // delete
  // Object.keys(markerInstances.value).forEach((key) => {
  //   const marker = markers.findIndex((e) => {
  //     return e!.getLatLng().toString() === key;
  //   });
  //   if (marker < 0) {
  //     markerInstances.value[key].removeFrom(leaflet.value!);
  //   }
  // });
  // markerInstances.value = markers.reduce(
  //   (acc, e) => ((acc[e!.getLatLng().toString()] = e), acc),
  //   {},
  // );
  // console.log(markers.length);
};

// watch(
//   () => selectedMarker.value,
//   async (latLng) => {
//     if (!leaflet.value) return;
//     const { popup } = await import('leaflet');

//     if (latLng) {
//       popupInstance.value ??= popup().setContent(() => {
//         return document.querySelector('#popupElement') as HTMLElement;
//       });
//       popupInstance.value.setLatLng(latLng).openOn(leaflet.value);
//       emits('on-pressed-marker', [latLng.lat, latLng.lng]);
//     } else if (popupInstance.value) {
//       popupInstance.value.closePopup();
//     }
//   },
// );

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
onBeforeUnmount(() => leaflet.value?.remove());

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
  <div ref="container" class="w-100 h-100"></div>
</template>
