<script setup lang="ts">
import { mdiOpenInNew, mdiUpload } from '@mdi/js';

// uses
const { t } = useI18n();
const sidebar = useSidebar();

// states
const providers = ref([
  {
    url: 'https://github.com/trongtindev/wutheringwaves-app-scanner',
    name: 'scanner.wutheringwaves.app',
    description:
      'This web-based scanner can capture your game window, scan from a screenshot, or scan from a video. The screenshot/video capture can be fullscreen and does not need to be cropped.\n\nMobile/PlayStation can only be scanned from screenshots or video.',
  },
]);

// head meta
const title = t('meta.calculator.import.title');
const description = t('meta.calculator.import.description');

useAppBar().setTitle(t('calculator.import.title'));
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- page -->
    <base-alert :text="$t('calculator.import.introduce')" />

    <!-- list -->
    <v-row>
      <v-col
        v-for="(element, index) in providers"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-img :aspect-ratio="16 / 9" />

          <v-card-title>
            {{ element.name }}
          </v-card-title>

          <v-card-text>
            <div :innerHTML="element.description.replaceAll('\n', '<br />')" />
          </v-card-text>

          <v-card-actions>
            <v-btn
              :href="element.url"
              :text="$t('common.navigate')"
              :append-icon="mdiOpenInNew"
              :disabled="true"
              target="_blank"
              variant="tonal"
            />
            <v-spacer />

            <v-btn
              :href="element.url"
              :text="$t('common.uploadData')"
              :prepend-icon="mdiUpload"
              :disabled="true"
              color="primary"
              target="_blank"
              variant="tonal"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
