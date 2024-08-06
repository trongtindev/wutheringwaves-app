<script setup lang="ts">
const props = defineProps<{
  name: string;
  type?: 'text' | 'chip';
}>();

// uses
const i18n = useI18n();

// events
const onPressed = () => {
  alert('Ok');
};
</script>

<template>
  <v-chip
    v-if="props.type == 'chip'"
    :text="$t(props.name)"
    @click="onPressed"
  />
  <span
    v-else
    class="cursor-pointer"
    @click="onPressed"
  >
    {{ $t(props.name) }}
  </span>
</template>
