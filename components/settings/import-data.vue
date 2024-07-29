<script setup lang="ts">
import { mdiUpload } from '@mdi/js';

// uses
const fileDialog = useFileDialog({
  accept: import.meta.dev ? 'text/*' : 'text/csv',
  multiple: false
});

// functions
const detectSource = (data: string, type: string) => {
  console.log(type, data);
};

// changes
watch(fileDialog.files, async (fileList) => {
  if (fileList == null) return;
  const file = fileList.item(0);
  if (file == null) return;

  file
    .text()
    .then((result) => detectSource(result, file.type))
    .catch(alert);
});
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('settings.importData.title') }}
    </v-card-title>

    <v-card-text>
      {{ $t('settings.importData.introduce') }}
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-card-btn
        :prepend-icon="mdiUpload"
        :text="$t('settings.importData.import')"
        @click="() => fileDialog.open({ reset: true })"
      />
    </v-card-actions>
  </v-card>
</template>
