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
  <v-card :to="localePath(`/echoes/${props.item.slug}`)">
    <v-responsive :aspect-ratio="1">
      <v-img
        :src="`/echoes/icons/${props.item.slug}.webp`"
        class="align-end h-100"
        cover
      />

      <div
        class="position-absolute left-0 top-0 pl-2 pt-2 d-flex flex-column ga-2"
      >
        <v-hover v-for="sonata in item.sonataEffects" :key="sonata.slug">
          <template #default="hover">
            <v-chip
              v-bind="hover.props"
              class="pa-1 rounded-xl"
              :style="`color: ${sonata.colors.border};`"
            >
              <v-img
                class="bg-grey-darken-3 rounded-circle"
                :width="16"
                :height="16"
                :src="sonata.icon"
                :alt="sonata.name"
                :style="`background: ${sonata.colors.background};`"
              />

              <div v-if="hover.isHovering" class="ml-2">
                {{ sonata.name }}
              </div>
            </v-chip>
          </template>
        </v-hover>
      </div>

      <div class="position-absolute right-0 top-0 pr-2 pt-2 d-flex">
        <v-hover>
          <template #default="hover">
            <v-chip v-bind="hover.props" color="info" class="pa-1 rounded-xl">
              <div v-if="hover.isHovering" class="mr-2">
                {{ $t('common.cost') }}
              </div>

              <v-sheet
                :width="16"
                :height="16"
                class="d-flex align-center justify-center"
              >
                {{ props.item.cost }}
              </v-sheet>
            </v-chip>
          </template>
        </v-hover>
      </div>
    </v-responsive>

    <v-card-title class="text-center" tag="h2">
      {{ nameLocalized }}
    </v-card-title>
  </v-card>
</template>
