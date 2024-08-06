<script setup lang="ts">
import type { IMapCategory } from '~/interfaces/map';

// define
const emits = defineEmits<{
  (e: 'on-markers', values: string[]);
}>();

const props = defineProps<{
  counter: { [key: string]: number };
}>();

// uses
const settings = useSettings();

// states
const tab = ref();
const markers = ref<{ [key: string]: string[] }>({});
const categories = ref<IMapCategory[]>([]);
const defaultValues = ref<{ [key: string]: string[] }>({});

// functions
const initialize = async () => {
  const prevMarkers = await settings.get('map.markers', {});
  defaultValues.value = prevMarkers;
  console.log('defaultValues', prevMarkers);

  const mapData = await import('~/resources/map.json');
  categories.value = mapData.default.categories as IMapCategory[];
  tab.value = categories.value[0].name;
};

// events
const onMarkers = (key: string, values: string[]) => {
  console.log('onMarkers', values);

  markers.value[key] = values;
  settings.set('map.markers', markers.value);

  emits(
    'on-markers',
    Object.keys(markers.value)
      .map((e) => {
        return markers.value[e];
      })
      .flatMap((e) => e),
  );
};

// lifecycle
onNuxtReady(initialize);
</script>

<template>
  <v-row :no-gutters="true" class="h-100">
    <v-col cols="4" class="h-100 overflow-y-auto">
      <v-list :nav="true" :lines="false" class="border-e h-100">
        <v-tooltip v-for="(element, index) in categories" :key="index">
          <template #activator="tooltip">
            <v-list-item
              v-bind="tooltip.props"
              :active="tab == element.name"
              @click="() => (tab = element.name)"
            >
              <v-list-item-title>
                {{ $t(`map.categories.${element.name}`) }}
              </v-list-item-title>
            </v-list-item>
          </template>

          <div>{{ $t(`map.categories.${element.name}`) }}</div>
        </v-tooltip>
      </v-list>
    </v-col>

    <v-col cols="8" class="pa-2 h-100 overflow-y-auto">
      <div v-for="(element, index) in categories" :key="index">
        <v-sheet
          :style="tab === element.name ? '' : `display:none`"
          :value="element.name"
        >
          <map-panel-self v-if="element.type == 'self'" />
          <map-panel-characters
            v-else-if="element.type == 'characters'"
            @on-markers="(val) => onMarkers(element.name, val)"
          />
          <map-panel-markers
            v-else
            :item="element"
            :counter="props.counter"
            :default-value="defaultValues[element.name]"
            @on-markers="(val) => onMarkers(element.name, val)"
          />
        </v-sheet>
      </div>
    </v-col>
  </v-row>
</template>
