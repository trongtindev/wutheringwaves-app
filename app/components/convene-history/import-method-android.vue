<script setup lang="ts">
import { mdiImport } from '@mdi/js';

// define
const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();

// states
const step = ref(1);
const data = ref<string>();

// computed
const canImport = computed(() => {
  return typeof extractedUrl.value === 'string';
});

const extractedUrl = computed(() => {
  if (data.value) {
    const matches = data.value.match(/https?:\/\/[^\s]+/);
    if (matches && matches.length > 0) return matches[0];
  }
  return null;
});

// events
const next = () => {
  step.value += 1;
};

const prev = () => {
  step.value -= 1;
};

const onPressedImport = () => emits('on-import', extractedUrl.value!);
</script>

<template>
  <v-stepper-vertical v-model="step">
    <template #default>
      <!-- step1 -->
      <v-stepper-vertical-item
        :complete="step > 1"
        :title="$t('convene.import.guides.android.default.1.title')"
        :value="1"
      >
        <v-responsive
          class="border rounded"
          :aspect-ratio="16 / 9"
          :max-width="500"
        >
          <iframe
            class="w-100 h-100"
            src="https://www.youtube.com/embed/HiFXNgsZx6g"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </v-responsive>

        <template #next>
          <v-btn color="primary" :text="$t('common.next')" @click="next" />
        </template>
        <template #prev></template>
      </v-stepper-vertical-item>

      <!-- step2 -->
      <v-stepper-vertical-item
        :title="$t('convene.import.guides.android.default.2.title')"
        :value="2"
      >
        <v-textarea
          v-model="data"
          type="url"
          placeholder="Webpage not available
The webpage at https://aki-gm-resources-oversea.aki-game.net"
          :hide-details="true"
        />

        <template #next>
          <v-btn
            color="primary"
            :disabled="!canImport"
            :prepend-icon="mdiImport"
            :text="$t('convene.import.title')"
            @click="onPressedImport"
          />
        </template>

        <template #prev>
          <v-btn variant="plain" :text="$t('common.previous')" @click="prev" />
        </template>
      </v-stepper-vertical-item>
    </template>
  </v-stepper-vertical>
</template>
