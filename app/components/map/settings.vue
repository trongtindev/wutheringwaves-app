<script setup lang="ts">
import type { IMapSettings } from '~/interfaces/map';

// define
const props = defineProps<{
  defaultValue: IMapSettings;
}>();

const emits = defineEmits<{
  (e: 'on-updated', value: IMapSettings);
  (e: 'on-close');
}>();

// states
const opacity = ref(props.defaultValue.opacity);
const pinCluster = ref(props.defaultValue.pinCluster);
const hideMarkedPins = ref(props.defaultValue.hideMarkedPins);

// functions
const emitChanged = () => {
  const data: IMapSettings = {
    opacity: opacity.value,
    pinCluster: pinCluster.value,
    hideMarkedPins: hideMarkedPins.value,
  };
  emits('on-updated', data);
};

// changes
watch(opacity, emitChanged);
watch(pinCluster, emitChanged);
watch(hideMarkedPins, emitChanged);
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('map.settings.title') }}
    </v-card-title>

    <v-list-item
      :title="$t('map.settings.pinCluster.title')"
      :subtitle="$t('map.settings.pinCluster.description')"
    >
      <template #append>
        <v-switch v-model="pinCluster" :hide-details="true" />
      </template>
    </v-list-item>

    <v-list-item
      :title="$t('map.settings.hideMarkedPins.title')"
      :subtitle="$t('map.settings.hideMarkedPins.description')"
    >
      <template #append>
        <v-switch v-model="hideMarkedPins" :hide-details="true" />
      </template>
    </v-list-item>

    <div class="pl-2 pr-2">
      <v-slider
        v-model="opacity"
        :label="$t('map.settings.opacity')"
        :max="1"
        :min="0.5"
        :step="0.1"
      />
    </div>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
