<script setup lang="ts">
// define
const emits = defineEmits<{
  (e: 'on-updated'): void;
}>();

// uses
const i18n = useI18n();
const dialog = useDialog();
const account = useAccount();
const database = useDatabase();

// events
const onPressedDelete = async (playerId: string, isConfirmed?: boolean) => {
  if (isConfirmed) {
    const db = await database.getInstance();
    await db.accounts.deleteOne({ playerId });
    await db.convenes.deleteMany({ playerId });
  } else {
    dialog.show({
      color: 'error',
      title: i18n.t('settings.accounts.deleteConfirm'),
      content: i18n.t('settings.accounts.deleteConfirmMessage'),
      onConfirm: () => onPressedDelete(playerId, true),
      confirmButtonText: i18n.t('common.delete')
    });
  }
};

// lifecycle
onNuxtReady(() => emits('on-updated'));
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        {{ $t('settings.accounts.title') }}
      </v-card-title>

      <div v-if="account.items.length > 0">
        <settings-account-item
          v-for="(element, index) in account.items"
          :key="index"
          :data="element"
          :class="{
            'mt-2': index > 0
          }"
          @on-delete="() => onPressedDelete(element.playerId)"
        />
      </div>

      <v-card-text v-else>
        {{ $t('settings.accounts.empty') }}
      </v-card-text>
    </v-card>
  </div>
</template>
