<script setup lang="ts">
import type * as L from 'leaflet';
import type { IMapPinSummary } from '~/interfaces/map';

// define
const emits = defineEmits<{
  (e: 'on-hide-all'): void;
  (e: 'on-marked', value: boolean): void;
}>();

const props = defineProps<{
  id: number;
  marker: L.Marker;
}>();

// uses
const api = useApi();
const i18n = useI18n();
const dialog = useDialog();
const account = useAccount();
const database = useDatabase();
const settings = useSettings();

// states
const isMarked = ref(false);
const summary = ref<IMapPinSummary>();

// functions
const checkMarked = () => {
  const [id] = database.mapMarked.findOne({
    pinId: props.id,
    playerId: account.active ? account.active.playerId : undefined,
  });
  isMarked.value = typeof id !== 'undefined';
};

const loadPinSummary = () => {
  summary.value = undefined;
  api.get<IMapPinSummary>(`map/pins/${props.id}/summary`).then((result) => {
    summary.value = result.data;
  });
};

const checkAndShowTip = async () => {
  if (settings.get('map.guides.multipleAccounts', false)) return;

  dialog.show({
    title: i18n.t('common.didYouKnow'),
    content: i18n.t('map.guides.multipleAccounts.description'),
  });
  settings.set('map.guides.multipleAccounts', true);
};

// events
// const onPressedHideAll = () => emits('on-hide-all');

const onPressedMarkAsFound = async () => {
  isMarked.value = true;
  props.marker.setOpacity(0.25);

  database.mapMarked.updateOne(
    {
      pinId: props.id,
      playerId: account.active ? account.active.playerId : undefined,
    },
    {},
    { upsert: true },
  );

  emits('on-marked', isMarked.value);
  checkAndShowTip();
};

const onPressedMarkAsNotFound = async () => {
  isMarked.value = false;
  props.marker.setOpacity(1);

  database.mapMarked.deleteOne({
    pinId: props.id,
    playerId: account.active ? account.active.playerId : undefined,
  });

  emits('on-marked', isMarked.value);
};

// changes
watch(
  () => props.id,
  () => {
    checkMarked();
    loadPinSummary();
  },
);

watch(() => account.active, checkMarked);

// lifecycle
onMounted(() => {
  checkMarked();
  loadPinSummary();
});
</script>

<template>
  <v-card>
    <!-- <v-card-title> #{{ props.id }} </v-card-title> -->

    <v-sheet :max-height="480" class="overflow-y-auto">
      <comments :lite="true" :load-more="true" :channel="`mapPin.${props.id}`">
        <!-- summary -->
        <template #prepend-list>
          <v-skeleton-loader v-if="!summary" type="sentences" />
          <v-alert
            v-else-if="summary.content"
            color="info"
            class="ml-4 mr-4 mb-2"
            :title="$t('common.aiGenerated')"
            :text="summary.content"
          />
        </template>
      </comments>
    </v-sheet>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="isMarked"
        :text="$t('map.markAsNotFound')"
        @click="() => onPressedMarkAsNotFound()"
      />
      <v-btn
        v-else
        :text="$t('map.markAsFound')"
        @click="() => onPressedMarkAsFound()"
      />
    </v-card-actions>
  </v-card>
</template>
