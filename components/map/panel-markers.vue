<script setup lang="ts">
import { mdiCheckCircle } from '@mdi/js';
import type { IMapCategory } from '~/interfaces/map';

// define
const props = defineProps<{
  item: IMapCategory;
  defaultValue?: string[];
}>();

const emits = defineEmits<{
  (e: 'on-markers', markers: string[]);
}>();

// states
const selected = ref<string[]>([]);

// functions
const initialize = () => {
  console.warn('ok', props.item.name, props.defaultValue);
};

// events
const onPressed = (type: string) => {
  const position = selected.value.findIndex((e) => {
    return type === e;
  });

  if (position >= 0) {
    selected.value.splice(position, 1);
  } else {
    selected.value.push(type);
  }

  emits('on-markers', selected.value);
};

// lifecycle
onMounted(initialize);
</script>

<template>
  <div class="pt-2 pr-2">
    <v-row>
      <v-col
        v-for="(element, index) in props.item.items || []"
        :key="index"
        cols="3"
      >
        <v-card @click="() => onPressed(element)">
          <!-- icon -->
          <v-img
            :src="`/map/icons/${element}.webp`"
            :aspect-ratio="1"
            :cover="true"
            class="rounded bg-background"
          >
            <div
              v-if="selected.includes(element)"
              class="w-100 h-100 d-flex align-center justify-center"
            >
              <v-icon :icon="mdiCheckCircle" color="primary" />
            </div>
          </v-img>

          <!-- title -->
          <v-card-title class="text-caption pa-0 text-center">
            {{ element }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
