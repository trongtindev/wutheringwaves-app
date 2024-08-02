<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import type {
  Marker,
  Map,
  MapOptions,
  TileLayerOptions,
  TileLayer,
  MarkerClusterGroup,
} from 'leaflet';
import { mdiArrowLeft, mdiArrowRight, mdiArrowUp } from '@mdi/js';
import { useDisplay } from 'vuetify';

// define
const { FILE_URL } = useRuntimeConfig().public;

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const sidebar = useSidebar();
const database = useDatabase();
const display = useDisplay();

// states
const map = shallowRef<Map>();
const tileLayer = shallowRef<TileLayer>();
const markerClusterGroup = shallowRef<MarkerClusterGroup>();
const mapOptions: MapOptions = {
  zoom: 11,
  center: [0, 0],
  minZoom: 11,
  maxZoom: 15,
  zoomControl: false,
};
const panel = ref(true);
const markerData = ref<IMarker[]>([]);
const addedNormalMarkers = shallowRef<{
  [key: string]: { type: string; marker: Marker };
}>({});
const addedClusterMarkers = shallowRef<{ id: string; marker: Marker }[]>([]);
const foundMarkers = ref<string[]>(null as any);
const locationMarkers = shallowRef<Marker[]>([]);
const subLocationMarkers = shallowRef<Marker[]>([]);

// computed
const urlTemplate = computed(() => {
  if (import.meta.dev && route.query.localTiles) {
    return '/map/tiles/{z}/{getX}_{getY}.webp';
  }
  return `${FILE_URL}/tiles/{z}/{getX}_{getY}.webp`;
});

// functions
const loadMarkers = () => {
  return new Promise((resolve, reject) => {
    api
      .get<any[][]>('/map/markers')
      .then((result) => {
        markerData.value = result.data.map((e) => {
          return {
            id: e[0],
            type: e[1],
            lat: e[2],
            lng: e[3],
          };
        });
        resolve(true);
      })
      .catch(reject);
  });
};

const loadMarked = () => {
  return new Promise((resolve, reject) => {
    database
      .getInstance()
      .then((db) => {
        db.markers
          .find()
          .exec()
          .then((documents) => {
            foundMarkers.value = documents
              .filter((e) => !e.type)
              .map((e) => e.key);
            resolve(true);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

const loadLeaflet = () => {
  return new Promise((resolve) => {
    const check = () => {
      if (map.value) {
        resolve(true);
        return;
      }
      setTimeout(check, 50);
    };
    setTimeout(check, 50);
  });
};

const addLocations = () => {
  mapLocations.forEach((location) => {
    const name = i18n.t(`map.locations.${location.name}`);
    const marker = window.leaflet
      .marker([location.latLng[0], location.latLng[1]], {
        icon: window.leaflet.divIcon({
          html: `<div class="text-center text-h5 text-white">${name}</div>`,
          iconSize: [200, 32],
          className: 'marker',
        }),
      })
      .addTo(map.value!);
    locationMarkers.value.push(marker);
  });

  mapLocations
    .flatMap((e) => e.items || [])
    .forEach((location) => {
      const name = i18n.t(`map.locations.${location.name}`);
      const marker = window.leaflet
        .marker([location.latLng[0], location.latLng[1]], {
          icon: window.leaflet.divIcon({
            html: `<div class="text-center text-h6 text-white">${name}</div>`,
            iconSize: [200, 32],
            className: 'marker',
          }),
          opacity: 0.1,
        })
        .addTo(map.value!);
      subLocationMarkers.value.push(marker);
    });
};

const newMarker = (e: any) => {
  const icon = (() => {
    if (['z1', 'z2'].includes(e.type)) {
      return `/map/icons/${e.type}.webp`;
    }
    return `/map/pins/${e.type}.webp`;
  })();
  const latLng = window.leaflet.latLng(e.lat, e.lng);
  const marker = window.leaflet.marker(latLng, {
    icon: window.leaflet.icon({
      iconUrl: icon,
      iconSize: [28, 28],
    }),
  });
  return {
    id: `${e.type}-${e.id}`,
    type: e.type,
    marker,
  };
};

const addNormalMarkers = (types: string[]) => {
  const normalMarkers = types
    .map((type) => {
      return markerData.value.filter((e) => {
        return e.type === type;
      });
    })
    .flatMap((e) => e)
    .map(newMarker);

  const normalMarkerAdded = normalMarkers.filter((e) => {
    return !addedNormalMarkers.value[e.id];
  });
  normalMarkerAdded.forEach((e) => {
    addedNormalMarkers.value[e.id] = e;
    e.marker.addTo(map.value!);
  });

  const normalMarkerRemoved = Object.keys(addedNormalMarkers.value).filter(
    (key) => {
      return !normalMarkers.find((e) => e.id === key);
    },
  );
  normalMarkerRemoved.forEach((e) => {
    addedNormalMarkers.value[e].marker.remove();
    delete addedNormalMarkers.value[e];
  });
};

const addClusterMarkers = (types: string[]) => {
  // create cluster group
  if (!markerClusterGroup.value) {
    markerClusterGroup.value = window.leaflet.markerClusterGroup({
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
    map.value!.addLayer(markerClusterGroup.value!);
  }

  const markers = types
    .map((type) => {
      return markerData.value.filter((e) => {
        return e.type === type;
      });
    })
    .flatMap((e) => e)
    .map(newMarker);

  const added = markers.filter((marker) => {
    return !addedClusterMarkers.value.find((e) => e.id === marker.id);
  });
  added.forEach((e) => {
    addedClusterMarkers.value.push({
      id: e.id,
      marker: e.marker,
    });
    markerClusterGroup.value!.addLayer(e.marker);
  });

  const removed = addedClusterMarkers.value.filter((addedClusterMarker) => {
    return !markers.find((e) => e.id === addedClusterMarker.id);
  });
  markerClusterGroup.value!.removeLayers(removed.map((e) => e.marker));
  while (removed.length > 0) {
    const index = addedClusterMarkers.value.findIndex(
      (e) => e.id === removed[0].id,
    );
    if (index < 0) break;

    removed.splice(0, 1);
    addedClusterMarkers.value[index].marker.remove();
    addedClusterMarkers.value.splice(index, 1);
  }
};

const addMarkers = (types: string[]) => {
  const normalTypes = ['z1', 'z2', 'z13'];
  addNormalMarkers(types.filter((type) => normalTypes.includes(type)));
  addClusterMarkers(types.filter((type) => !normalTypes.includes(type)));
};

const addTiles = () => {
  const tileOptions: TileLayerOptions & {
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
    /**
     * Tiles and markers copied from appsample
     */
    attribution:
      '&copy; <a href="https://genshin-impact-map.appsample.com/wuthering-waves-map/">Appsample</a>',
  };

  tileLayer.value = window.leaflet
    .tileLayer(urlTemplate.value, tileOptions)
    .addTo(map.value!);
};

const initialize = async () => {
  // wait all loaded
  await Promise.all([loadMarkers(), loadMarked(), loadLeaflet()]);

  // hide sidebar
  if (sidebar.open) sidebar.open = false;

  addLocations();
  addTiles();
};

const updateLocations = (level: number) => {
  locationMarkers.value.forEach((location) => {
    location.setOpacity(level <= 12 ? 1 : 0.1);
  });
  subLocationMarkers.value.forEach((location) => {
    location.setOpacity(level <= 12 ? 0.1 : 1);
  });
};

// events
const onMapZoom = (level: number) => updateLocations(level);

const onFilterMarkers = (values: string[]) => {
  if (!map.value) return;

  const items = values.map((e) => {
    if (!e.startsWith('z') && mapSlugMarker[e]) {
      return mapSlugMarker[e];
    }
    return e;
  });

  addMarkers(items);
};

// lifecycle
onNuxtReady(() => initialize());

// seo meta
const title = i18n.t('map.title');
const description = i18n.t('meta.map.description');

useAppBar().setTitle(i18n.t('map.title'));
useSeoMeta({
  ogTitle: title,
  description: description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <v-fab
      v-if="display.mdAndUp.value"
      :prepend-icon="panel ? mdiArrowLeft : mdiArrowRight"
      color="primary"
      location="top start"
      size="48"
      fixed
      app
      appear
      @click="() => (panel = !panel)"
    />

    <v-fab
      v-else
      :prepend-icon="mdiArrowUp"
      color="primary"
      location="bottom right"
      size="48"
      fixed
      app
      appear
      @click="() => (panel = !panel)"
    />

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
              <map-leaflet
                :height="height"
                :options="mapOptions"
                @on-initialized="(val) => (map = val)"
                @on-zoom="onMapZoom"
              />
            </template>
          </base-screen>

          <!-- panel -->
          <base-panel v-model="panel" location="left">
            <template #default="props">
              <v-card :min-height="props.height" class="h-100">
                <map-panel @on-markers="(val) => onFilterMarkers(val)" />
              </v-card>
            </template>
          </base-panel>
        </div>
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
