<script setup lang="ts">
// uses
const i18n = useI18n();
const dialog = useDialog();
const account = useAccount();
const database = useDatabase();

// states
const state = ref<'' | 'erase'>('');

// events
const onPressedDelete = async (playerId: string, isConfirmed?: boolean) => {
  if (isConfirmed) {
    // TODO: <3
  } else {
    dialog.show({
      color: 'error',
      title: i18n.t('settings.accounts.eraseAllData'),
      content: i18n.t('settings.accounts.eraseAllDataConfirm')
    });
  }
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        {{ $t('settings.accounts.title') }}
      </v-card-title>
      <v-divider />

      <v-list v-if="account.items">
        <settings-account-item
          v-for="(element, index) in account.items"
          :key="index"
          :data="element"
          :class="{
            'mt-2': index > 0
          }"
        />
      </v-list>

      <v-card-text v-else>
        <v-alert color="info" :text="$t('settings.accounts.empty')" />
      </v-card-text>
    </v-card>
  </div>
</template>
