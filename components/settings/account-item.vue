<script setup lang="ts">
import type { AccountDocument } from '~/composables/database';

// define
const props = defineProps<{
  data: AccountDocument;
}>();
const emits = defineEmits<{
  (e: 'on-delete'): void;
}>();

// uses
const database = useDatabase();

// states
const autoImport = ref(props.data.autoImport);

// changes
watch(
  () => autoImport.value,
  (value) => {
    database.accounts.updateOne(
      {
        playerId: props.data.playerId,
      },
      {
        autoImport: value,
      },
    );
  },
);
</script>

<template>
  <div>
    <v-sheet class="pl-4 pr-4">
      <v-row :no-gutters="true">
        <v-col class="d-flex align-center text-caption text-secondary">
          {{ props.data.playerId }}
        </v-col>

        <v-col class="d-flex justify-end align-center">
          <v-chip
            color="red"
            :text="$t('common.delete')"
            @click="() => emits('on-delete')"
          />
        </v-col>
      </v-row>
    </v-sheet>

    <v-list-item
      :title="$t('settings.accounts.autoImportConveneHistory')"
      :subtitle="$t('settings.accounts.autoImportConveneHistorySubtitle')"
    >
      <template #append>
        <v-switch v-model="autoImport" :hide-details="true" />
      </template>
    </v-list-item>
  </div>
</template>
