<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import { mdiMapMarker, mdiComment, mdiAccount } from '@mdi/js';

// uses
const app = useApp();
const api = useApi();
const i18n = useI18n();
const router = useRouter();
const sidebar = useSidebar();
const database = useDatabase();

// states
const drawer = ref(true);
const tab = ref('markers');
const markers = ref<IMarker[]>();
const selected = ref<IMarker>();
const foundMarkers = ref<string[]>(null as any);
const displayMarkers = ref<IMarker[]>([]);
const hideFound = ref(false);

// events
const onPressedMarker = (item: IMarker, args: any) => {
  console.log('onPressedMarker', item, args);
  selected.value = item;
  if (tab.value != 'comments') {
    tab.value = 'comments';
  }
  router.replace({
    query: {
      id: selected.value.id
    }
  });
};

const onActiveChanged = (keys: { [key: string]: boolean }, emit?: boolean) => {
  if (!markers.value) {
    setTimeout(() => onActiveChanged(keys), 250);
    return;
  }

  if (!emit) {
    setTimeout(() => onActiveChanged(keys, true), 100);
    return;
  }

  displayMarkers.value = markers.value.filter((e) => {
    return keys[e.type];
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
  app.fluid = true;
  sidebar.open = false;

  // get markers
  api
    .getInstance()
    .get<any[][]>('/map/markers')
    .then((result) => {
      markers.value = result.data.map((e) => {
        return {
          id: e[0],
          s: e[1],
          type: e[2],
          mid: e[3],
          level: e[4],
          lng: e[5],
          lat: e[6],
          desc: e[7]
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
      });
  });
};

// lifecycle
onMounted(initialize);

onUnmounted(() => {
  app.fluid = true;
  sidebar.open = true;
});

// seo meta
const title = i18n.t('map.title');
const description = i18n.t('meta.map.description');

useHead({ title });
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
            <map-markers
              v-if="markers"
              :markers="markers"
              @on-active-changed="(val) => onActiveChanged(val)"
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
      <card-title>
        <template #title>
          {{ $t('map.title') }}
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-responsive :aspect-ratio="16 / 9">
        <client-only>
          <l-map
            v-if="foundMarkers"
            class="w-100 h-100"
            :zoom="11"
            :min-zoom="11"
            :max-zoom="15"
            :center="[0, 0]"
            :zoom-snap="0.5"
            :use-global-leaflet="false"
            :options="{
              maxBounds: [
                [1, 1],
                [-1, -1]
              ]
            }"
          >
            <l-tile-layer
              url="https://files.astrite.app/tiles/{z}/{getX}/{getY}.webp"
              layer-type="base"
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
            />

            <div v-for="(element, index) in displayMarkers" :key="index">
              <map-marker-item
                :data="element"
                :default-value="foundMarkers.includes(`${element.id}`)"
                @on-pressed="(args) => onPressedMarker(element, args)"
                @on-mark-changed="(val) => onMarkChanged(element.id, val)"
              />
            </div>
          </l-map>
        </client-only>
      </v-responsive>
    </v-card>

    <!-- <v-btn class="position-fixed" text="OK" @click="() => (drawer = !drawer)" /> -->
  </div>
</template>
