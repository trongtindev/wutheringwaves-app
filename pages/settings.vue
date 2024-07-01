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
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/settings',
          title: i18n.t('settings.title')
        }
      ]"
    />

    <v-alert
      v-if="!auth.isLoggedIn"
      type="warning"
      class="mb-4"
      :text="$t('Sign in to sync settings and data')"
    />

    <client-only>
      <v-row>
        <v-col cols="12" sm="6">
          <settings-notification />
        </v-col>

        <v-col cols="12" sm="6">
          <settings-account />
        </v-col>

        <v-col cols="12" sm="6">
          <settings-cloud-backup />
        </v-col>

        <v-col cols="12" sm="6">
          <settings-analytics />
        </v-col>

        <v-col cols="12" sm="6">
          <settings-erase-data />
        </v-col>
      </v-row>
    </client-only>
  </div>
</template>
