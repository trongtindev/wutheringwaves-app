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
  <div v-if="props.data.url && !props.data.items">
    <v-list-item
      :to="localePath(props.data.url)"
      :rel="props.data.rel"
      :title="$t(props.data.title)"
      :exact="index === 0"
      :active="
        index > 0
          ? route.path.startsWith(localePath(props.data.url))
          : undefined
      "
      :disabled="props.data.upcoming && !inDev"
      :class="{
        'ml-12': props.submenu,
      }"
      @click="() => sidebar.onOpened(props.data.url!)"
    >
      <template v-if="!props.submenu" #prepend>
        <v-sheet
          class="mr-4 d-flex align-center justify-center"
          :width="32"
          :height="32"
        >
          <v-img
            v-if="props.data.icon && props.data.icon.startsWith('/')"
            :src="props.data.icon"
            :alt="$t(props.data.title)"
            :width="28"
            :height="28"
          />
          <v-icon v-else :icon="props.data.icon" :width="28" :height="28" />
        </v-sheet>
      </template>

      <template #append>
        <client-only>
          <v-badge
            v-if="sidebar.notify[props.data.url]"
            :content="sidebar.notify[props.data.url].value"
            color="red"
            inline
          />
        </client-only>

        <v-chip v-if="props.data.beta && !props.submenu" color="info">
          {{ $t('common.beta') }}
        </v-chip>
        <v-chip
          v-else-if="props.data.upcoming && !props.submenu"
          color="warning"
        >
          {{ $t('common.upcoming') }}
        </v-chip>
      </template>
    </v-list-item>
  </div>
  <nav-group v-else :data="props.data" :index="props.index" />
</template>
