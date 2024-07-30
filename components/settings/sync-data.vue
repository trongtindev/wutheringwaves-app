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
    <v-card-title>
      {{ $t('settings.syncData.title') }}
    </v-card-title>

    <v-card-text>
      {{ $t('settings.syncData.introduce') }}
    </v-card-text>

    <v-card-actions>
      <v-chip class="ml-1">
        {{
          $t('sync.lastSynced', {
            time: sync.lastCloudChanged
              ? dayjs(sync.lastCloudChanged).fromNow()
              : $t('common.none'),
          })
        }}
      </v-chip>

      <v-spacer />

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
    </v-card-actions>
  </v-card>
</template>
