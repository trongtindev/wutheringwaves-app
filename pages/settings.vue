<script setup lang="ts">
// uses
const i18n = useI18n();
const auth = useAuth();

// seo meta
const title = i18n.t('meta.settings.title');

useHead({
  title,
  meta: [
    {
      name: 'robots',
      content: 'noindex'
    }
  ]
});
</script>

<template>
  <client-only>
    <v-row>
      <v-col cols="12" md="7">
        <settings-notification />
        <settings-account class="mt-2" />
        <settings-cloud-backup class="mt-2" />
        <settings-analytics class="mt-2" />
        <settings-export-data class="mt-2" />
        <settings-erase-data class="mt-2" />
      </v-col>

      <v-col cols="12" md="5" lg="4">
        <iframe
          src="https://discordapp.com/widget?id=1249656911167750144&theme=dark"
          width="100%"
          height="500"
          allowtransparency="true"
          frameborder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          class="bg-surface rounded-lg"
        />
      </v-col>
    </v-row>
  </client-only>
</template>
