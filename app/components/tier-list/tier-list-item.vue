<script setup lang="ts">
import type { ITierList, ITierListRow } from '@/interfaces/tier-list';

const props = defineProps<{
  data: ITierList;
}>();

// uses
const router = useRouter();
const localePath = useLocalePath();

// events
const onPressed = () => {
  router.push(localePath(`/tier-list/${props.data.id}`));
};

// computed
const rows = computed(() => {
  const rows: ITierListRow[] = JSON.parse(props.data.content);
  return rows;
});
</script>

<template>
  <router-link
    :to="localePath(`/tier-list/${props.data.id}`)"
    @click="onPressed"
  >
    <tier-list-row
      :to="localePath(`/tier-list/${props.data.id}`)"
      :type="props.data.type"
      :data="rows[0]"
    />
  </router-link>
</template>
