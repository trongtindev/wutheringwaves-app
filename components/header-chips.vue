<script setup lang="ts">
import { mdiGithub, mdiOpenInNew, mdiBug } from '@mdi/js';

// define
const { APP_DISCORD, APP_REPO } = useRuntimeConfig().public;

const props = defineProps<{
  github?: string;
}>();
</script>

<template>
  <div class="d-flex flex-wrap ga-2 justify-center">
    <v-chip
      :href="`${APP_REPO}/issues/new/choose`"
      :text="$t('common.openIssues')"
      :prepend-icon="mdiBug"
      :append-icon="mdiOpenInNew"
      color="warning"
      target="_blank"
      rel="nofollow"
    />

    <v-chip
      :href="`${APP_REPO}/${props.github}`"
      :text="$t('common.editThisPage')"
      :prepend-icon="mdiGithub"
      :append-icon="mdiOpenInNew"
      target="_blank"
      rel="nofollow"
    />

    <v-chip
      :href="APP_DISCORD"
      :text="$t('common.joinTheDiscord')"
      :append-icon="mdiOpenInNew"
      target="_blank"
      rel="nofollow"
    />
  </div>
</template>
