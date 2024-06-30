<script setup lang="ts">
import type { ICode } from '@/interfaces/code';

const props = defineProps<{
  data: ICode;
}>();

// uses
const clipboard = useClipboard();

// states
const state = ref<'' | 'copied'>('');

// events
const onPressedCopy = async () => {
  await clipboard.copy(props.data.code);

  state.value = 'copied';
  setTimeout(() => {
    state.value = '';
  }, 1500);
};

// computed
const isExpired = computed(() => {
  if (
    props.data.expiredAt &&
    dayjs(props.data.expiredAt).toDate().getTime() < new Date().getTime()
  ) {
    return true;
  }
  return false;
});

// changes
</script>

<template>
  <div>
    <v-list-item :disabled="isExpired">
      <template #title>
        <span class="mr-2">
          {{ props.data.code }}
        </span>

        <v-chip v-if="isExpired" type="warning" :text="$t('codes.expired')" />
        <v-chip
          v-else
          color="success"
          :text="state == 'copied' ? $t('common.copied') : $t('common.copy')"
          @click="onPressedCopy"
        />
      </template>
    </v-list-item>
    <div v-if="props.data.rewards" class="pl-4 pb-4">
      <v-card>
        <v-card-text>
          <ul class="pl-4">
            <li v-for="(element, index) in props.data.rewards" :key="index">
              {{ element.quantity }} {{ element.item }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
