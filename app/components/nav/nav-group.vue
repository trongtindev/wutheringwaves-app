<script setup lang="ts">
const props = defineProps<{
  data: IMenu;
  index: number;
}>();

// uses
const i18n = useI18n();
const site = useSite();

// computed
const title = computed(() => {
  return i18n.t(props.data.title);
});
</script>

<template>
  <v-list-item
    v-if="props.data.upcoming && !site.inDev"
    :title="title"
    :nav="true"
    :disabled="true"
  >
    <template #prepend>
      <v-avatar :size="24">
        <v-img
          v-if="props.data.icon && props.data.icon.startsWith('/')"
          :src="props.data.icon"
          :alt="title"
        />
        <v-icon v-else :icon="props.data.icon" />
      </v-avatar>
    </template>

    <template #append>
      <v-chip v-if="props.data.beta" color="success">
        {{ $t('common.beta') }}
      </v-chip>
      <v-chip v-else-if="props.data.preview" color="info">
        {{ $t('common.preview') }}
      </v-chip>
      <v-chip v-else-if="props.data.upcoming" color="warning">
        {{ $t('common.upcoming') }}
      </v-chip>
    </template>
  </v-list-item>

  <v-list-group v-else :value="title" :fluid="true">
    <template #activator="group">
      <v-list-item v-bind="group.props" :title="title" :nav="true">
        <template #prepend>
          <v-avatar :size="24" class="border-0">
            <v-img
              v-if="props.data.icon && props.data.icon.startsWith('/')"
              :src="props.data.icon"
              :alt="title"
            />
            <v-icon v-else :icon="props.data.icon" />
          </v-avatar>
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
