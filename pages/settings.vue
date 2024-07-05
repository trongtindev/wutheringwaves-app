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

    <client-only>
      <masonry>
        <template #default="masonry">
          <settings-notification />
          <settings-account />
          <settings-cloud-backup />
          <settings-analytics />
          <settings-export-data @on-updated="masonry.refreshLayout" />
          <settings-erase-data />
        </template>
      </masonry>
    </client-only>
  </div>
</template>
