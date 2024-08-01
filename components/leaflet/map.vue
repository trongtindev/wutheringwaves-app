<script setup lang="ts">
import type { Map, MapOptions, Marker, LatLng, Popup } from 'leaflet';

// define
const props = defineProps<{
  compass?: number[];
  markers?: {
    latlng: number[];
    icon?: string | undefined;
    title?: string | undefined;
    opacity?: number | undefined;
  }[];
  options: MapOptions;
}>();

const emits = defineEmits<{
  (e: 'on-initialized', instance: Map): void;
  (e: 'on-drag', latLng: number[]): void;
  (e: 'on-pressed-marker', latLng: number[]): void;
}>();

// uses
const i18n = useI18n();
const snackbar = useSnackbar();
const renderMarkerDebounce = useDebounceFn(() => renderMarker(), 250);
const renderMarkerLimitThrottle = useThrottleFn(() => {
  snackbar.show({
    content: i18n.t('map.markerLimit'),
  });
}, 5000);
const windowSize = useWindowSize();

// states
const zoom = ref(props.options.zoom ?? 1);
const baseZoomLevel = ref(zoom.value);
const center = ref([0, 0]);
const leaflet = ref<Map>();
const container = ref();
const selectedMarker = ref<LatLng>();
const markerInstances = ref<{ [key: string]: Marker }>({});
const popupInstance = ref<Popup>();
const playerCompass = ref<Marker>();

// computed
const markerLimitCount = computed(() => {
  return import.meta.dev ? 250 : 500;
});

// functions
const initialize = async () => {
  if (!container.value) {
    setTimeout(initialize, 50);
    return;
  }

  if (!window.leaflet) {
    setTimeout(initialize, 50);
    return;
  }

  const { Map } = window.leaflet;
  leaflet.value = new Map(container.value, props.options);
  leaflet.value.invalidateSize();

  leaflet.value.on('click', (e) => {
    if (!leaflet.value) return;

    console.log('leaflet', 'click', {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
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
  // leaflet.value.on('zoom', () => {
  //   if (!leaflet.value) return;
  //   zoom.value = leaflet.value.getZoom();
  // });
  // leaflet.value.on('drag', () => {
  //   if (!leaflet.value) return;
  //   const latLng = leaflet.value.getCenter();
  //   center.value = [latLng.lat, latLng.lng];
  //   emits('on-drag', [latLng.lat, latLng.lng]);
  // });

  // playerCompass.value = marker([0, 0], { opacity: 0 }).addTo(leaflet.value);

  // emits('on-initialized', leaflet.value);
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

// changes
watch(
  () => props.markers,
  () => renderMarkerDebounce(),
);

watch(
  () => center.value,
  () => renderMarkerDebounce(),
);

watch(
  () => zoom.value,
  () => renderMarkerDebounce(),
);

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

// watch(
//   () => props.compass,
//   async (value) => {
//     if (!value) return;
//     if (!leaflet.value) return;
//     if (!playerCompass.value) return;

//     const { divIcon } = await import('leaflet');
//     const rotation = value[3];
//     const x = value[0] / 1000000;
//     const z = value[1] / 1000000;
//     // const [x, y, z, r] = value;

//     playerCompass.value.setOpacity(1);
//     playerCompass.value.setIcon(
//       divIcon({
//         html: `<img src="/map/compass.png" style="transform: rotate(${rotation}deg);" />`,
//         iconSize: [28, 28],
//       }),
//     );
//     playerCompass.value.setLatLng([x, z]);
//     leaflet.value.panTo([x, z]);

//     console.log([x, z]);
//   },
// );

// changes
watch(windowSize.height, (height) => {
  console.log('height', height);
});

// lifecycle
onNuxtReady(() => initialize());
onBeforeUnmount(() => leaflet.value?.remove());

// head
useHead({
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
      integrity:
        'sha512-BwHfrr4c9kmRkLw6iXFdzcdWV/PGkVgiIyIWLLlTSXzWQzxuSg4DiQUCpauz/EWjgk5TYQqX/kvn9pG1NpYfqg==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
    },
  ],
  link: [
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
      rel: 'stylesheet',
      integrity:
        'sha512-Zcn6bjR/8RZbLEpLIeOwNtzREBAJnUKESxces60Mpoj+2okopSAcSUIUOseddDm0cxnGQzxIR7vJgsLZbdLE3w==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
    },
  ],
});
</script>

<template>
  <div ref="container" class="w-100 h-100">
    <slot v-if="leaflet" :leaflet="leaflet" />

    <div id="popupElement">
      <slot
        v-if="selectedMarker"
        name="popup"
        :leaflet="leaflet"
        :lat-lng="selectedMarker"
      />
    </div>
  </div>
</template>
