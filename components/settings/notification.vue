<script setup lang="ts">
import { mdiTrashCan } from '@mdi/js';

// uses
const i18n = useI18n();
const dialog = useDialog();
const notification = useNotification();
const { isIos } = useDevice();
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        {{ $t('settings.notification.title') }}
      </v-card-title>
      <v-divider />

      <v-card-text v-if="!notification.isSupported">
        <v-alert
          v-if="isIos"
          :text="$t('settings.notification.iosNotSupported')"
          color="warning"
        />
        <v-alert
          :text="$t('settings.notification.deviceNotSupported')"
          color="warning"
        />
      </v-card-text>
      <v-list v-else>
        <v-list-item
          :title="$t('settings.notification.enabled')"
          :subtitle="$t('settings.notification.enabledSubtitle')"
        >
          <template #append>
            <v-switch v-model="notification.enabled" :disabled="true" />
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
