<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';

// define
const emits = defineEmits<{
  (e: 'on-pressed', args: any): void;
  (e: 'on-mark-changed', status: boolean): void;
}>();

const props = defineProps<{
  data: IMarker;
  defaultValue: boolean;
}>();

// uses
const database = useDatabase();

// states
const isFound = ref(props.defaultValue);
const restart = ref(false);

// computed
const iconUrl = computed(() => {
  if (['z1', 'z2'].includes(props.data.type)) {
    return `/map/icons/${props.data.type}.webp`;
  }
  return `/map/pins/${props.data.type}.webp`;
});

// events
const onPressed = (args) => emits('on-pressed', args);

const onPressedMarkAsFound = async () => {
  isFound.value = true;
  restart.value = true;

  const db = await database.getInstance();
  db.markers.upsert({
    key: `${props.data.id}`
  });
  emits('on-mark-changed', true);

  // toggle re-renderer
  setTimeout(() => (restart.value = false), 50);
};

const onPressedMarkAsNotFound = async () => {
  isFound.value = false;
  restart.value = true;

  // remove document
  const db = await database.getInstance();
  db.markers
    .findOne({
      selector: {
        key: `${props.data.id}`
      }
    })
    .exec()
    .then((document) => {
      if (document) document.remove();
    });

  // toggle re-renderer
  setTimeout(() => (restart.value = false), 50);

  emits('on-mark-changed', false);
};
</script>

<template>
  <div>
    <div v-if="restart"></div>
    <l-marker
      v-else
      :lat-lng="[props.data.lat, props.data.lng]"
      :options="{
        opacity: isFound ? 0.25 : 1
      }"
      @click="onPressed"
    >
      <!-- <l-icon
        v-if="props.data.text"
        class-name="text-center"
        :icon-size="[75, 50]"
      >
        {{ $t(props.data.text) }}
      </l-icon> -->

      <l-icon :icon-url="iconUrl" :icon-size="[28, 28]" />

      <l-popup>
        <div class="text-center">
          {{ isFound ? 1 : 0 }}
          <div class="font-weight-bold">x{{ props.data }}x</div>
          <div>
            <v-btn
              v-if="isFound"
              size="small"
              :text="$t('map.markAsNotFound')"
              @click="() => onPressedMarkAsNotFound()"
            />
            <v-btn
              v-else
              size="small"
              :text="$t('map.markAsFound')"
              @click="() => onPressedMarkAsFound()"
            />
          </div>
        </div>
      </l-popup>
    </l-marker>
  </div>
</template>
