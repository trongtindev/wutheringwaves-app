<script setup lang="ts">
import type { AccountDocument } from '@/collections/account';

const props = defineProps<{
  data: AccountDocument;
}>();
</script>

<template>
  <div>
    <v-sheet class="pl-4 pr-4">
      <v-row :no-gutters="true">
        <v-col class="d-flex align-center">
          {{ props.data.playerId }}
        </v-col>

        <v-col class="d-flex justify-end align-center">
          <v-chip color="red" :disabled="true" :text="$t('common.delete')" />
        </v-col>
      </v-row>
    </v-sheet>

    <v-list-item
      :disabled="true"
      :title="$t('settings.accounts.autoImportConveneHistory')"
      :subtitle="$t('settings.accounts.autoImportConveneHistorySubtitle')"
    >
      <template #append>
        <v-switch />
      </template>
    </v-list-item>
  </div>
</template>
