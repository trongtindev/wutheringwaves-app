<script lang="ts" setup>
import type { IEcho } from '~/interfaces/echo';

const props = defineProps<{
  item: IEcho;
}>();

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// computed
const nameLocalized = computed(() => {
  return i18n.t(props.item.name);
});
</script>

<template>
  <v-card :to="localePath(`/echos/${props.item.slug}`)">
    <v-responsive :aspect-ratio="1">
      <v-img
        :src="`/echos/icons/${props.item.slug}.webp`"
        class="align-end h-100"
        cover
      />
    </v-responsive>
    <v-divider />

    <v-card-title class="text-center" tag="h2">
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
