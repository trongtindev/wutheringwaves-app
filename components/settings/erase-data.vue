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
const sync = useSync();
const database = useDatabase();

// states
const state = ref<'' | 'erase'>('');

// events
const onPressedConfirm = async (confirm?: boolean) => {
  if (!confirm) {
    dialog.show({
      color: 'warning',
      title: i18n.t('settings.eraseData.confirm.title'),
      content: i18n.t('settings.eraseData.confirm.message'),
      onConfirm: () => onPressedConfirm(true)
    });
    return;
  }

  try {
    state.value = 'erase';

    await database.eraseAllData();
    if (auth.isLoggedIn) {
      await sync.eraseAll();
    }

    window.location.reload();
  } catch (error) {
    alert(error);
  } finally {
    state.value = '';
  }
};

// lifecycle
onNuxtReady(() => emits('on-updated'));
</script>

<template>
  <v-card
    :title="$t('settings.eraseData.title')"
    color="warning"
    variant="tonal"
  >
    <v-card-text>
      {{ $t('settings.eraseData.introduce') }}
    </v-card-text>

    <v-card-actions class="d-flex justify-end">
      <v-btn
        :disabled="state != ''"
        :loading="state == 'erase'"
        :text="$t('settings.eraseData.eraseNow')"
        :prepend-icon="mdiTrashCan"
        variant="tonal"
        @click="() => onPressedConfirm()"
      />
    </v-card-actions>
  </v-card>
</template>
