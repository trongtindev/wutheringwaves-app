<script lang="ts" setup>
import { mdiClose } from '@mdi/js';
import type { INotification } from '~/interfaces/notification';

// define
const props = defineProps<{
  data: INotification;
}>();

// uses
const notification = useNotification();

// events
const onPressed = () => notification.remove(props.data.id);
</script>

<template>
  <v-card class="pt-2 pb-2" :color="props.data.color || 'info'">
    <v-list-item>
      <template #prepend>
        <v-icon v-if="props.data.icon" :icon="props.data.icon" />
        <v-avatar v-else-if="props.data.persistent">
          <v-progress-circular
            v-if="props.data.progress && props.data.progress < 100"
            :model-value="props.data.progress"
          />
          <v-progress-circular v-else :indeterminate="true" />
        </v-avatar>
      </template>

      <v-list-item-title>
        {{ props.data.title }}
      </v-list-item-title>

      <v-list-item-subtitle v-if="props.data.message">
        {{ props.data.message }}
      </v-list-item-subtitle>

      <template #append>
        <v-btn
          v-if="!props.data.persistent"
          variant="text"
          size="small"
          :icon="mdiClose"
          @click="onPressed"
        />
      </template>
    </v-list-item>
  </v-card>
</template>
