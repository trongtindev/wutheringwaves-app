<script setup lang="ts">
import { mdiBug, mdiGithub, mdiOpenInNew, mdiTranslate } from '@mdi/js';

// define
const { DISCORD_INVITE_LINK, SITE_REPO } = useRuntimeConfig().public;

const props = defineProps<{
  github?: string;
  translate?: { [key: string]: string };
}>();

// uses
const localePath = useLocalePath();

// events
const onPressedTranslate = () => {
  window.location.href = localePath({
    path: '/commit',
    query: props.translate,
  });
};
</script>

<template>
  <div class="d-flex flex-wrap ga-2 justify-center">
    <v-chip
      :href="`${SITE_REPO}/issues/new/choose`"
      :text="$t('common.openIssues')"
      :prepend-icon="mdiBug"
      :append-icon="mdiOpenInNew"
      color="warning"
      target="_blank"
      rel="nofollow"
    />

    <v-chip
      v-if="props.translate"
      :text="$t('common.translateThisPage')"
      :prepend-icon="mdiTranslate"
      rel="nofollow"
      @click="onPressedTranslate"
    />

    <v-chip
      v-if="props.github"
      :href="`${SITE_REPO}/${props.github}`"
      :text="$t('common.editThisPage')"
      :prepend-icon="mdiGithub"
      :append-icon="mdiOpenInNew"
      target="_blank"
      rel="nofollow"
    />

    <v-chip
      :href="DISCORD_INVITE_LINK"
      :text="$t('common.joinTheDiscord')"
      :append-icon="mdiOpenInNew"
      target="_blank"
      rel="nofollow"
    />
  </div>
</template>
