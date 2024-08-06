<script setup lang="ts">
import { mdiCheckCircle } from '@mdi/js';
import type { IMapCategory } from '~/interfaces/map';

// define
const props = defineProps<{
  item: IMapCategory;
  counter: { [key: string]: number };
  defaultValue?: string[];
}>();

const emits = defineEmits<{
  (e: 'on-markers', markers: string[]);
}>();

// uses
const i18n = useI18n();

// states
const selected = ref<string[]>([]);

// computed
const items = computed(() => {
  return (props.item.items || []).map((e) => {
    return {
      type: e,
      name: i18n.t(`map.pins.${mapPinName[e] || e}`),
    };
  });
});

// functions
const initialize = () => {
  console.debug('ok', props.item.name, props.defaultValue);
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
  <v-row>
    <v-col v-for="(element, index) in items" :key="index" cols="4" md="3">
      <v-tooltip location="bottom">
        <template #activator="tooltip">
          <v-card v-bind="tooltip.props" @click="() => onPressed(element.type)">
            <!-- icon -->
            <v-img
              :src="`/map/icons/${element.type}.webp`"
              :aspect-ratio="1"
              :cover="true"
              class="rounded bg-background"
            >
              <div
                v-if="selected.includes(element.type)"
                class="w-100 h-100 d-flex align-center justify-center"
              >
                <v-icon :icon="mdiCheckCircle" color="primary" />
              </div>

              <v-sheet
                size="small"
                class="text-caption position-absolute bottom-0 right-0 rounded-ts pr-1 pl-1"
                :color="tooltip.isActive ? 'info' : undefined"
                :class="tooltip.isActive ? '' : 'op-70'"
              >
                {{ props.counter[element.type] || 0 }}
              </v-sheet>
            </v-img>

            <!-- title -->
            <v-card-title class="text-caption pa-0 text-center">
              {{ element.name }}
            </v-card-title>
          </v-card>
        </template>

        <div>
          {{ element.name }}
        </div>
      </v-tooltip>
    </v-col>
  </v-row>
</template>
