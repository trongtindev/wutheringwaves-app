<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import type { Map, MapOptions, TileLayerOptions } from 'leaflet';
import { mdiCogs, mdiMapMarker, mdiComment, mdiAccount } from '@mdi/js';

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const sidebar = useSidebar();
const database = useDatabase();
const desktopApp = useDesktopApp();

// states
const leaflet = ref<Map>();
const options: MapOptions = {
  zoom: 11,
  center: [0, 0],
  minZoom: 11,
  maxZoom: 15,
  markerZoomAnimation: true,
  attributionControl: false,
  preferCanvas: true,
};
const tileLayerOptions: TileLayerOptions & { getX: any; getY: any } = {
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
  return `https://files.wutheringwaves.app/tiles/{z}/{getX}_{getY}.webp`;
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

useApp().title = i18n.t('map.title');
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
    <!-- <v-navigation-drawer v-model="drawer" :width="400">
      <client-only>
        <v-tabs v-model="tab" :fixed-tabs="true">
          <v-tab value="markers">
            <v-icon :icon="mdiMapMarker" />
          </v-tab>
          <v-tab value="comments">
            <v-icon :icon="mdiComment" />
          </v-tab>
          <v-tab value="account">
            <v-icon :icon="mdiAccount" />
          </v-tab>
        </v-tabs>
        <v-divider />

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="markers" class="pa-2">
            <v-card class="mb-2">
              <v-list-item :title="$t('map.hideFoundMarkers')">
                <template #append>
                  <v-switch v-model="hideFound" :hide-details="true" />
                </template>
              </v-list-item>
            </v-card>

            <map-markers
              v-if="markers"
              :markers="markers"
              @on-active-changed="(val) => (shows = val)"
            />

            <div v-else class="text-center">
              <v-progress-circular :indeterminate="true" />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="comments">
            <map-comments :selected="selected" />
          </v-tabs-window-item>
        </v-tabs-window>
      </client-only>
    </v-navigation-drawer> -->
    <client-only>
      <v-card>
        <v-responsive :aspect-ratio="16 / 9">
          <lazy-leaflet-map
            :compass="
              desktopApp.player
                ? [
                    desktopApp.player.x,
                    desktopApp.player.y,
                    desktopApp.player.z,
                    desktopApp.player.r,
                  ]
                : undefined
            "
            :options="options"
            @on-initialized="(val) => (leaflet = val)"
            @on-pressed-marker="(val) => onPressedMarker(val)"
          >
            <template #default="{ leaflet }">
              <lazy-leaflet-tile-layer
                :leaflet="leaflet"
                :options="tileLayerOptions"
                :url-template="urlTemplate"
              />
            </template>

            <!-- <template #popup>
            <map-popup
              v-if="selected"
              :data="selected"
              :initial-value="foundMarkers.includes(selected.id.toString())"
              @on-mark-changed="(val) => onMarkChanged(selected!.id, val)"
            />
          </template> -->
          </lazy-leaflet-map>
        </v-responsive>
      </v-card>

      <base-panel v-model="panel">
        <template #default="props">
          <v-card :min-height="props.height" class="h-100">
            <v-tabs v-model="tab" :fixed-tabs="true">
              <v-tab value="markers">
                <v-icon :icon="mdiMapMarker" />
              </v-tab>
              <v-tab value="comments">
                <v-icon :icon="mdiComment" />
              </v-tab>
              <v-tab value="account">
                <v-icon :icon="mdiAccount" />
              </v-tab>
            </v-tabs>
          </v-card>
        </template>
      </base-panel>
    </client-only>

    <v-fab
      :prepend-icon="mdiCogs"
      color="primary"
      location="bottom end"
      size="64"
      fixed
      app
      appear
      @click="() => (panel = !panel)"
    />
  </div>
</template>
