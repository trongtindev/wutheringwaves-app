<script setup lang="ts">
const props = defineProps<{
  data: IMenu;
  index: number;
  submenu?: boolean;
}>();

// uses
const route = useRoute();
const sidebar = useSidebar();
const localePath = useLocalePath();

// computed
const inDev = import.meta.dev;
</script>

<template>
  <v-list-item
    v-if="props.data.url && !props.data.items"
    :to="localePath(props.data.url)"
    :rel="props.data.rel"
    :exact="index === 0"
    :active="
      index > 0 ? route.path.startsWith(localePath(props.data.url)) : undefined
    "
    :disabled="props.data.upcoming && !inDev"
    :class="{
      'ml-10': props.submenu,
    }"
    @click="() => sidebar.onOpened(props.data.url!)"
  >
    <template
      v-if="!props.submenu"
      #prepend
    >
      <v-avatar
        :size="24"
        rounded
      >
        <v-img
          v-if="props.data.icon && props.data.icon.startsWith('/')"
          :src="props.data.icon"
          :alt="$t(props.data.title)"
        />
        <v-icon
          v-else
          :icon="props.data.icon"
        />
      </v-avatar>
    </template>

    <v-list-item-title tag="h2">
      {{ $t(props.data.title) }}
    </v-list-item-title>

    <template #append>
      <client-only>
        <v-badge
          v-if="sidebar.notify[props.data.url]"
          :content="sidebar.notify[props.data.url].value"
          color="red"
          inline
        />
      </client-only>

      <v-chip
        v-if="props.data.beta"
        color="info"
      >
        {{ $t('common.beta') }}
      </v-chip>
      <v-chip
        v-else-if="props.data.upcoming"
        color="warning"
      >
        {{ $t('common.upcoming') }}
      </v-chip>
    </template>
  </v-list-item>

  <nav-group
    v-else
    :data="props.data"
    :index="props.index"
  />
</template>
