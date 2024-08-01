<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import type { Map, MapOptions, TileLayerOptions } from 'leaflet';
import { mdiCogs, mdiMapMarker, mdiComment, mdiAccount } from '@mdi/js';

// define
const { FILE_URL } = useRuntimeConfig().public;

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const sidebar = useSidebar();
const database = useDatabase();

// states
const leaflet = ref<Map>();
const options: MapOptions = {
  zoom: 11,
  center: [0, 0],
  minZoom: 11,
  maxZoom: 15,
  markerZoomAnimation: true,
  // attributionControl: false,
  preferCanvas: true,
  zoomControl: false,
};
const tileLayerOptions: TileLayerOptions & {
  getX: typeof leafletGetX;
  getY: typeof leafletGetY;
} = {
  tms: true,
  noWrap: true,
  bounds: [
    [-1, -1],
    [1, 1],
  ],
  getX: leafletGetX,
  getY: leafletGetY,
};
const panel = ref(true);
const tab = ref('markers');
const shows = ref<{ [key: string]: boolean }>({});
const markers = ref<IMarker[]>();
const selected = ref<IMarker>();
const foundMarkers = ref<string[]>(null as any);
const hideFound = ref(false);

// computed
const urlTemplate = computed(() => {
  if (import.meta.dev && route.query.localTiles) {
    return '/map/tiles/{z}/{getX}_{getY}.webp';
  }
  return `${FILE_URL}/tiles/{z}/{getX}_{getY}.webp`;
});

const displayMarkers = computed(() => {
  return (markers.value || [])
    .filter((e) => {
      if (hideFound.value) {
        if (foundMarkers.value.includes(e.id.toString())) {
          return false;
        }
      }
      return shows.value[e.type];
    })
    .map((e) => {
      const icon = (() => {
        if (['z1', 'z2'].includes(e.type)) {
          return `/map/icons/${e.type}.webp`;
        }
        return `/map/pins/${e.type}.webp`;
      })();
      return {
        latlng: [e.lat, e.lng],
        icon,
        title: `${e.id} ${e.type}`,
        opacity: foundMarkers.value.includes(e.id.toString()) ? 0.25 : 1,
      };
    });
});

// events
const onPressedMarker = (latLng: number[]) => {
  console.log('onPressedMarker', latLng);

  if (!markers.value) return;
  selected.value = markers.value.find((e) => {
    return latLng.toString() == [e.lat, e.lng].toString();
  });

  if (tab.value != 'comments') {
    tab.value = 'comments';
  }
  router.replace({
    query: {
      id: selected.value ? selected.value.id : undefined,
    },
  });
};

const onMarkChanged = (id: number, status: boolean) => {
  if (status) {
    foundMarkers.value.push(`${id}`);
  } else {
    const index = foundMarkers.value.findIndex((e) => e === `${id}`);
    if (index >= 0) foundMarkers.value.splice(index, 1);
  }
};

// functions
const initialize = () => {
  // get markers
  api.get<any[][]>('/map/markers').then((result) => {
    markers.value = result.data.map((e) => {
      return {
        id: e[0],
        type: e[1],
        lat: e[2],
        lng: e[3],
      };
    });
  });

  // get found markers
  database.getInstance().then((db) => {
    db.markers
      .find()
      .exec()
      .then((documents) => {
        foundMarkers.value = documents.filter((e) => !e.type).map((e) => e.key);
        console.log('foundMarkers.value', foundMarkers.value);
      });
  });
};

// lifecycle
onMounted(() => {
  sidebar.overlay = true;
  setTimeout(initialize, 1000);
});

onUnmounted(() => {
  sidebar.overlay = true;
});

// seo meta
const title = i18n.t('map.title');
const description = i18n.t('meta.map.description');

useAppBar().setTitle(i18n.t('map.title'));
useHead({
  title,
  meta: route.query.id
    ? [
        {
          name: 'robots',
          content: 'noindex',
        },
      ]
    : [],
});
useSeoMeta({
  ogTitle: title,
  description: description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <v-card>
      <client-only>
        <template #fallback>
          <div class="leaflet-map pa-4">
            {{ $t('common.loading') }}
          </div>
        </template>

        <div>
          <base-screen :ratio="0.95">
            <template #default="{ height }">
              <leaflet-map
                :height="height"
                :options="options"
                @on-initialized="(val) => (leaflet = val)"
                @on-pressed-marker="(val) => onPressedMarker(val)"
              >
                <template #default="{ leaflet: instance }">
                  <leaflet-tile-layer
                    :leaflet="instance"
                    :options="tileLayerOptions"
                    :url-template="urlTemplate"
                  />
                </template>
              </leaflet-map>
            </template>
          </base-screen>

          <!-- panel -->
          <base-panel v-model="panel">
            <template #default="props">
              <v-card :min-height="props.height" class="h-100">
                <map-panel />
              </v-card>
            </template>
          </base-panel>
        </div>

        <v-fab
          :prepend-icon="mdiCogs"
          color="primary"
          location="top right"
          size="48"
          fixed
          app
          appear
          @click="() => (panel = !panel)"
        />
      </client-only>
    </v-card>

    <v-card class="mt-2">
      <v-card-title tag="h1">
        {{ $t('map.title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('meta.map.description') }}
      </v-card-text>
    </v-card>

    <!-- howToUse -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('common.howToUse', [$t('map.title')]) }}
      </v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
  </div>
</template>
