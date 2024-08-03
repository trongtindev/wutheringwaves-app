<script setup lang="ts">
import type { IMapMarker, IMapSettings } from '~/interfaces/map';
import type * as L from 'leaflet';
import {
  mdiArrowLeft,
  mdiArrowRight,
  mdiCogs,
  mdiMapMarkerPlus,
  mdiVectorPolyline,
} from '@mdi/js';
import { useDisplay } from 'vuetify';

// define
const { FILE_URL } = useRuntimeConfig().public;

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const sidebar = useSidebar();
const database = useDatabase();
const settings = useSettings();
const showSettings = ref(false);
const account = useAccount();
const dialog = useDialog();
const loading = ref(true);
const display = useDisplay();

// states
const map = shallowRef<L.Map>();
const mapSettingsData = ref<IMapSettings>({
  opacity: 1,
  pinCluster: true,
  hideMarkedPins: true,
});
const tileLayer = shallowRef<L.TileLayer>();
const mapOptions: L.MapOptions = {
  zoom: 11,
  center: [0, 0],
  minZoom: 11,
  maxZoom: 15,
  zoomControl: false,
};
const panel = ref(true);
const locationMarkers = shallowRef<L.Marker[]>([]);
const subLocationMarkers = shallowRef<L.Marker[]>([]);
const pins = shallowRef<
  {
    id: number;
    type: string;
    marker: L.Marker;
  }[]
>([]);
const markedPins = ref<number[]>([]);
const markers = shallowRef(new Map<number, IMapMarker>());
const counter = ref<{ [key: string]: number }>({});
const skipClusterShowTip = ref();

// computed
const panelWidth = computed(() => {
  return display.smAndDown.value ? 300 : 360;
});

const urlTemplate = computed(() => {
  if (import.meta.dev && route.query.localTiles) {
    return '/map/tiles/{z}/{getX}_{getY}.webp';
  }
  return `${FILE_URL}/tiles/{z}/{getX}_{getY}.webp`;
});

// functions
const checkAndClusterShowTip = async () => {
  const ignore = await new Promise<boolean>((resolve) => {
    if (skipClusterShowTip.value) {
      resolve(true);
      return;
    }
    settings.get('map.guides.pinCluster', false).then(resolve);
  });
  if (ignore) return;

  dialog.show({
    title: i18n.t('common.didYouKnow'),
    content: `${i18n.t('map.guides.pinCluster.description')} ${i18n.t('map.settings.pinCluster.description')}`,
  });

  skipClusterShowTip.value = true;
  settings.set('map.guides.pinCluster', true);
};

const loadPins = () => {
  return new Promise((resolve, reject) => {
    api
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .get<any[][]>('/map/markers')
      .then((result) => {
        const items = result.data.map((e) => {
          return {
            id: e[0],
            type: e[1],
            lat: e[2],
            lng: e[3],
          };
        });

        items.forEach((e) => {
          counter.value[e.type] ??= 0;
          counter.value[e.type] += 1;
        });

        pins.value = items.map((e) => {
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
            id: e.id,
            type: e.type,
            marker,
          };
        });

        resolve(true);
      })
      .catch(reject);
  });
};

const loadMarkedPins = () => {
  return new Promise((resolve, reject) => {
    database
      .getInstance()
      .then((db) => {
        db.markers
          .find({
            selector: {
              playerId: account.active,
            },
          })
          .exec()
          .then((docs) => {
            markedPins.value = docs.map((e) => parseInt(e.key));
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
        opacity: 0.9,
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
          opacity: 0,
        })
        .addTo(map.value!);
      subLocationMarkers.value.push(marker);
    });
};

const addTiles = () => {
  const tileOptions: L.TileLayerOptions & {
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
      '&copy; <a href="https://genshin-impact-map.appsample.com/wuthering-waves-map/" target="_blank" rel="nofollow">Appsample</a>',
  };

  tileLayer.value = window.leaflet
    .tileLayer(urlTemplate.value, tileOptions)
    .addTo(map.value!);
};

const initialize = async () => {
  await Promise.all([loadLeaflet(), loadMarkedPins()]);
  await loadPins();

  addLocations();
  addTiles();

  loading.value = false;
  if (sidebar.open) sidebar.open = false;
};

const updateLocations = (level: number) => {
  locationMarkers.value.forEach((location) => {
    location.setOpacity(level <= 12 ? 0.9 : 0);
  });
  subLocationMarkers.value.forEach((location) => {
    location.setOpacity(level <= 12 ? 0 : 0.9);
  });
};

// events
const onMapZoom = (level: number) => updateLocations(level);

const onFilterMarkers = (values: string[]) => {
  const types: string[] = values.map((e) => {
    if (!e.startsWith('z') && mapSlugMarker[e]) {
      return mapSlugMarker[e];
    }
    return e;
  });

  const newMap = new Map<number, IMapMarker>();
  pins.value
    .filter((e) => {
      return types.includes(e.type);
    })
    .forEach((e) => {
      newMap.set(e.id, {
        type: e.type,
        marker: e.marker,
      });
    });
  markers.value = newMap;

  checkAndClusterShowTip();
};

const onMarked = (id: number, value: boolean) => {
  const index = markedPins.value.findIndex((e) => e === id);
  if (index < 0 && value) {
    markedPins.value = [...markedPins.value, id];
  } else if (!value) {
    markedPins.value.splice(index, 1);
  }
};

// changes
watch(mapSettingsData, (newValue, oldValue) => {
  if (newValue.pinCluster !== oldValue.pinCluster) {
    console.debug('pinCluster', 'changed', newValue.pinCluster);
  }
});

watch(() => account.active, loadMarkedPins);

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
  <v-card>
    <client-only>
      <template #fallback>
        <div class="leaflet-map pa-4">
          {{ $t('common.loading') }}
        </div>
      </template>

      <base-screen v-slot="{ height }" class="position-relative">
        <map-leaflet
          :height="height"
          :marked="markedPins"
          :markers="markers"
          :exclude="markedPins"
          :cluster="mapSettingsData.pinCluster"
          :options="mapOptions"
          @on-initialized="(val) => (map = val)"
          @on-zoom="onMapZoom"
        >
          <template #popup="{ active }">
            <map-popup
              v-if="active"
              :id="active.id"
              :marker="active.marker"
              @on-marked="(val) => onMarked(active.id, val)"
            />
          </template>
        </map-leaflet>

        <div
          class="position-absolute position-relative top-0 z-9999 pa-2"
          style="transition: left 0.25s linear"
          :style="
            `width: ${panelWidth}px;` +
            (panel ? 'left:0px;' : `left: -${panelWidth - 8}px;`) +
            `height: ${height}px;`
          "
        >
          <v-card
            class="w-100 h-100"
            :class="display.smAndDown.value ? 'rounded-be-0' : 'rounded-te-0'"
            :style="`opacity: ${mapSettingsData.opacity};`"
          >
            <map-panel :counter @on-markers="(val) => onFilterMarkers(val)" />
          </v-card>

          <!-- menu -->
          <v-btn
            class="position-absolute rounded-e rounded-s-0"
            :class="display.smAndDown.value ? 'bottom-2' : 'top-2'"
            :style="`left: ${panelWidth - 8}px; opacity: ${mapSettingsData.opacity};`"
            :icon="panel ? mdiArrowLeft : mdiArrowRight"
            @click="() => (panel = !panel)"
          />
        </div>

        <!-- right button -->
        <div
          class="position-absolute top-2 right-2 z-9999 h-100"
          style="width: 48px"
        >
          <v-tooltip location="left">
            <template #activator="tooltip">
              <v-btn
                v-bind="tooltip.props"
                class="rounded"
                :style="`opacity: ${mapSettingsData.opacity};`"
                :icon="mdiCogs"
                @click="() => (showSettings = true)"
              />
            </template>

            <div>
              {{ $t('map.settings.title') }}
            </div>
          </v-tooltip>

          <v-tooltip location="left">
            <template #activator="tooltip">
              <v-btn
                v-bind="tooltip.props"
                class="mt-2 rounded"
                :style="`opacity: ${mapSettingsData.opacity};`"
                :icon="mdiMapMarkerPlus"
                :disabled="true"
              />
            </template>

            <div>
              {{ $t('map.settings.newPin') }}
            </div>
          </v-tooltip>

          <v-tooltip location="left">
            <template #activator="tooltip">
              <v-btn
                v-bind="tooltip.props"
                class="mt-2 rounded"
                :style="`opacity: ${mapSettingsData.opacity};`"
                :icon="mdiVectorPolyline"
                :disabled="true"
              />
            </template>

            <div>
              {{ $t('map.settings.route') }}
            </div>
          </v-tooltip>
        </div>
      </base-screen>

      <!-- settings dialog -->
      <v-dialog v-model="showSettings" :scrollable="true" :width="480">
        <map-settings
          :default-value="mapSettingsData"
          @on-close="() => (showSettings = false)"
          @on-updated="(val) => (mapSettingsData = val)"
        />
      </v-dialog>
    </client-only>

    <!-- loading -->
    <v-overlay
      v-model="loading"
      :contained="true"
      :persistent="true"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular :indeterminate="true" />
    </v-overlay>
  </v-card>
</template>
