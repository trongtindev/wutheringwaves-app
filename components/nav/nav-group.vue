<script setup lang="ts">
const props = defineProps<{
  data: IMenu;
  index: number;
}>();

// uses
const app = useApp();
const i18n = useI18n();
const route = useRoute();
const sidebar = useSidebar();
const localePath = useLocalePath();

// computed
const title = computed(() => {
  return i18n.t(props.data.title);
});
</script>

<template>
  <v-list-group :value="title">
    <template #activator="group">
      <v-list-item v-bind="group.props" :title="title" class="rounded">
        <template #prepend>
          <v-sheet
            class="mr-4 d-flex align-center justify-center"
            :width="32"
            :height="32"
          >
            <v-img
              v-if="props.data.icon && props.data.icon.startsWith('/')"
              :src="props.data.icon"
              :alt="title"
              :width="28"
              :height="28"
            />
            <v-icon v-else :icon="props.data.icon" :width="28" :height="28" />
          </v-sheet>
        </template>
      </v-list-item>
    </template>

    <nav-item
      v-for="(element, j) in props.data.items"
      :key="j"
      :data="element"
      :index="j"
      :submenu="true"
    />
  </v-list-group>
</template>
