<script setup lang="ts">
import { mdiUpload, mdiDownload, mdiCheck } from '@mdi/js';
import dayjs from 'dayjs';

// uses
const app = useApp();
const auth = useAuth();
const backup = useBackup();

// states
const state = ref<'' | 'backup' | 'restore'>('');
const isBackupDone = ref(false);
const isRestoreDone = ref(false);

// events
const onPressedBackup = () => {
  state.value = 'backup';
  backup
    .backup()
    .then(() => {
      isBackupDone.value = true;
    })
    .catch((error) => {
      // TODO: handle error
      console.error(error);
      alert(error);
    })
    .finally(() => {
      state.value = '';
    });
};

const onPressedRestore = () => {
  state.value = 'restore';
  backup
    .restore()
    .then(() => {
      isRestoreDone.value = true;
    })
    .catch((error) => {
      // TODO: handle error
      console.error(error);
      alert(error);
    })
    .finally(() => {
      state.value = '';
    });
};
</script>

<template>
  <v-card>
    <card-title>
      <template #title>
        {{ $t('settings.backup.title') }}
      </template>
    </card-title>

    <v-card-text>
      {{ app.name }} uses the Google Cloud Storage to save and sync your data.
      We can only read and write files that this site created.
    </v-card-text>
    <v-divider />

    <v-card-actions>
      <v-row>
        <v-col class="d-flex align-center">
          <span class="text-subtitle-2">
            {{
              $t('backup.lastCloudChanged', [
                backup.lastCloudChanged
                  ? dayjs(backup.lastCloudChanged).fromNow()
                  : $t('common.none')
              ])
            }}
          </span>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            :disabled="state !== '' || !auth.isLoggedIn"
            :loading="state === 'backup'"
            :text="$t('Backup')"
            :prepend-icon="isBackupDone ? mdiCheck : mdiUpload"
            :color="isBackupDone ? 'success' : undefined"
            variant="outlined"
            @click="onPressedBackup"
          />
          <v-btn
            :disabled="state !== '' || !auth.isLoggedIn"
            :loading="state === 'restore'"
            :text="$t('Restore')"
            :prepend-icon="isRestoreDone ? mdiCheck : mdiDownload"
            :color="isRestoreDone ? 'success' : undefined"
            variant="outlined"
            @click="onPressedRestore"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
