<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';

// define
const emits = defineEmits<{
  (e: 'on-mark-changed', status: boolean): void;
}>();

const props = defineProps<{
  data: IMarker;
  initialValue?: boolean | undefined;
}>();

// uses
const database = useDatabase();

// states
const isFound = ref(props.initialValue);

// events
const onPressedMarkAsFound = async () => {
  isFound.value = true;

  const db = await database.getInstance();
  db.markers.upsert({
    key: `${props.data.id}`
  });
  emits('on-mark-changed', true);
};

const onPressedMarkAsNotFound = async () => {
  isFound.value = false;

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

  emits('on-mark-changed', false);
};
</script>

<template>
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
</template>
