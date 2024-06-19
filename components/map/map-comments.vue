<script setup lang="ts">
import { mdiShare } from '@mdi/js';
import type { IMarker } from '~/interfaces/map';

// define
const props = defineProps<{
  selected?: IMarker;
}>();

// uses
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

// computed
const shareUrl = computed(() => {
  const siteUrl = runtimeConfig.public.SITE_URL;
  return `${siteUrl}/map/?id=${props.selected!.id}`;
});
</script>

<template>
  <div>
    <div v-if="!props.selected" class="pa-2">
      <v-alert color="warning" :text="$t('map.comments.pleaseSelectMarker')" />
    </div>

    <div v-else>
      <div class="pa-2">
        <v-text-field :value="shareUrl" :append-inner-icon="mdiShare" />
      </div>

      <comments
        :channel="`${route.path}#${props.selected.id}`"
        :flat="true"
        :hide-title="true"
      />
    </div>
  </div>
</template>
