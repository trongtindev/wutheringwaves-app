<script setup lang="ts">
import { mdiUpload, mdiDownload, mdiCheck } from '@mdi/js';
import dayjs from 'dayjs';

// uses
const auth = useAuth();
const sync = useSync();

// states
const state = ref<'' | 'push' | 'pull'>('');
const isPushed = ref(false);
const isPulled = ref(false);

// events
const onPressedPush = () => {
  state.value = 'push';
  sync
    .push()
    .then(() => {
      isPushed.value = true;
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

const onPressedPull = () => {
  state.value = 'pull';
  sync
    .pull()
    .then(() => {
      isPulled.value = true;
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
        {{ $t('sync.title') }}
      </template>
    </card-title>

    <v-card-text>
      We uses the Google Cloud Storage to save and sync your data. We can only
      read and write files that this site created.
    </v-card-text>
    <v-divider />

    <v-card-actions>
      <v-row>
        <v-col class="d-flex align-center">
          <v-chip class="ml-1">
            {{
              $t('sync.lastSynced', [
                sync.lastCloudChanged
                  ? dayjs(sync.lastCloudChanged).fromNow()
                  : $t('common.none')
              ])
            }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            :disabled="state !== '' || isPushed || !auth.isLoggedIn"
            :loading="state === 'push'"
            :text="$t('sync.push')"
            :prepend-icon="isPushed ? mdiCheck : mdiUpload"
            :color="isPushed ? 'success' : undefined"
            @click="onPressedPush"
          />
          <v-btn
            :disabled="state !== '' || isPulled || !auth.isLoggedIn"
            :loading="state === 'pull'"
            :text="$t('sync.pull')"
            :prepend-icon="isPulled ? mdiCheck : mdiDownload"
            :color="isPulled ? 'success' : undefined"
            @click="onPressedPull"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
