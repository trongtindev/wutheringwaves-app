<script setup lang="ts">
import type { ICode } from '@/interfaces/code';
import dayjs from 'dayjs';

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
</script>

<template>
  <td>
    <span class="mr-2">
      {{ props.data.code }}
    </span>

    <v-chip
      v-if="isExpired"
      type="warning"
      :text="$t('codes.expired')"
    />
    <v-chip
      v-else
      color="success"
      :text="state == 'copied' ? $t('common.copied') : $t('common.copy')"
      @click="onPressedCopy"
    />
  </td>

  <td>
    <ul class="pl-4">
      <li
        v-for="(element, index) in props.data.rewards"
        :key="index"
      >
        {{ element.quantity }} {{ element.item }}
      </li>
    </ul>
  </td>

  <td>
    {{ props.data.expiredAt ? dayjs(props.data.expiredAt).fromNow() : '' }}
  </td>
</template>
