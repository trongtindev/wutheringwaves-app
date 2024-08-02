<script setup lang="ts">
import type * as L from 'leaflet';

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
const i18n = useI18n();
const dialog = useDialog();
const account = useAccount();
const database = useDatabase();
const settings = useSettings();

// states
const isMarked = ref(false);

// functions
const checkMarked = () => {
  database.getInstance().then(async (db) => {
    const doc = await db.markers
      .findOne({
        selector: {
          key: `${props.id}`,
          playerId: account.active,
        },
      })
      .exec();
    isMarked.value = doc != null;
  });
};

const checkAndShowTip = async () => {
  const show = await new Promise<boolean>((resolve) => {
    settings.get('map.guides.multipleAccounts', false).then(resolve);
  });
  if (show) return;

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

  database.getInstance().then((db) => {
    db.markers.upsert({
      key: `${props.id}`,
      playerId: account.active,
    });
  });

  emits('on-marked', isMarked.value);
  checkAndShowTip();
};

const onPressedMarkAsNotFound = async () => {
  isMarked.value = false;
  props.marker.setOpacity(1);

  database.getInstance().then((db) => {
    db.markers.deleteOne({
      key: `${props.id}`,
      playerId: account.active,
    });
  });

  emits('on-marked', isMarked.value);
};

// changes
watch(() => props.id, checkMarked);
watch(() => account.active, checkMarked);
</script>

<template>
  <v-card>
    <v-card-title> #{{ props.id }} </v-card-title>

    <v-sheet :max-height="480" class="overflow-y-auto">
      <comments :lite="true" :load-more="true" :channel="`mapPin.${props.id}`" />
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
