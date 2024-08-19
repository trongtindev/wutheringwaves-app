<script setup lang="ts">
import moment from 'moment';
import type { AccountDocument } from '~/database/documents/account';

// define
const props = defineProps<{
  data: AccountDocument;
}>();
const emits = defineEmits<{
  (e: 'on-delete'): void;
}>();

// uses
const i18n = useI18n();
const database = useDatabase();

// states
const autoImport = ref(props.data.autoImport);

// computed
const lastUpdatedOn = computed(() => {
  if (props.data.lastImport) {
    return moment(props.data.lastImport).fromNow();
  }
  return i18n.t('common.none');
});

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
      :subtitle="$t('common.lastUpdatedOn', { time: lastUpdatedOn })"
    >
      <template #append>
        <v-switch v-model="autoImport" :hide-details="true" />
      </template>
    </v-list-item>
  </div>
</template>
