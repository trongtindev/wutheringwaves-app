<script setup lang="ts">
import { mdiTrashCan } from '@mdi/js';

// define
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const i18n = useI18n();
const auth = useAuth();
const dialog = useDialog();
const backup = useBackup();
const database = useDatabase();

// states
const state = ref<'' | 'erase'>('');

// events
const onPressedConfirm = async (isConfirmed?: boolean) => {
  if (isConfirmed) {
    try {
      state.value = 'erase';

      await database.eraseAllData();
      if (auth.isLoggedIn) {
        await backup.eraseAll();
      }

      window.location.reload();
    } catch (error) {
      alert(error);
    } finally {
      state.value = '';
    }
  } else {
    dialog.show({
      color: 'error',
      title: i18n.t('settings.eraseAllData'),
      content: i18n.t('settings.eraseAllDataConfirm'),
      onConfirm: () => onPressedConfirm(true)
    });
  }
};
</script>

<template>
  <div>
    <v-card color="error" variant="outlined">
      <v-card-title>
        {{ $t('settings.data.erase.title') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ $t('settings.data.erase.message') }}
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex justify-end">
        <v-btn
          :disabled="state != ''"
          :loading="state == 'erase'"
          :text="$t('settings.data.erase.button')"
          :prepend-icon="mdiTrashCan"
          color="error"
          variant="outlined"
          @click="() => onPressedConfirm()"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>
