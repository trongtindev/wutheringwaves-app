<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import { mdiMapMarker, mdiComment, mdiAccount } from '@mdi/js';
import type { MapOptions } from 'leaflet';

// uses
const app = useApp();
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const sidebar = useSidebar();
const database = useDatabase();
const appConfig = useAppConfig();

// states
const options: MapOptions = {
  zoom: 11,
  minZoom: 11,
  maxZoom: 15,
  center: [0, 0],
  zoomSnap: 0.5,
  maxBounds: [
    [1, 1],
    [-1, -1]
  ]
};
const drawer = ref(true);
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
  return `https://files.astrite.app/tiles/{z}/{getX}_{getY}.webp?v=${appConfig.buildNumber}`;
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
        opacity: foundMarkers.value.includes(e.id.toString()) ? 0.25 : 1
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
      id: selected.value ? selected.value.id : undefined
    }
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
  api
    .getInstance()
    .get<any[][]>('/map/markers')
    .then((result) => {
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
onNuxtReady(() => {
  sidebar.open = false;

  setTimeout(initialize, 1000);
});

onUnmounted(() => {
  sidebar.open = true;
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
          content: 'noindex'
        }
      ]
    : []
});
useSeoMeta({
  ogTitle: title,
  description: description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/map',
          title: i18n.t('map.title')
        }
      ]"
    />

    <!-- drawer -->
    <v-navigation-drawer v-model="drawer" :width="400">
      <!-- client only -->
      <client-only>
        <!-- tabs -->
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

        <!-- tabs content -->
        <v-tabs-window v-model="tab">
          <!-- markers -->
          <v-tabs-window-item value="markers" class="pa-2">
            <v-card class="mb-2">
              <v-list-item :title="$t('map.hideFoundMarkers')">
                <template #append>
                  <v-switch v-model="hideFound" />
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
          <!-- end markers -->

          <!-- comments -->
          <v-tabs-window-item value="comments">
            <map-comments :selected="selected" />
          </v-tabs-window-item>
          <!-- end comments -->

          <!-- end tabs content -->
        </v-tabs-window>
        <!-- end client only -->
      </client-only>
      <!-- end drawer -->
    </v-navigation-drawer>

    <v-card>
      <v-responsive :aspect-ratio="16 / 9">
        <lazy-leaflet-map
          v-if="foundMarkers"
          :markers="displayMarkers"
          :options="options"
          @on-pressed-marker="(val) => onPressedMarker(val)"
        >
          <template #default="{ leaflet }">
            <lazy-leaflet-tile-layer
              :leaflet="leaflet"
              :options="{
                tms: true,
                noWrap: true,
                bounds: [
                  [-1, -1],
                  [1, 1]
                ],
                getX: leafletGetX,
                getY: leafletGetY,
                attribution:
                  '<a href=\'https://genshin-impact-map.appsample.com/wuthering-waves-map/\' target=\'_blank\' rel=\'nofollow\'>appsample</a>'
              }"
              :url-template="urlTemplate"
            />
          </template>

          <template #popup>
            <map-popup
              v-if="selected"
              :data="selected"
              :initial-value="foundMarkers.includes(selected.id.toString())"
              @on-mark-changed="(val) => onMarkChanged(selected!.id, val)"
            />
          </template>
        </lazy-leaflet-map>
      </v-responsive>
    </v-card>

    <!-- <v-btn class="position-fixed" text="OK" @click="() => (drawer = !drawer)" /> -->
  </div>
</template>
