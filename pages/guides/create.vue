<script setup lang="ts">
// uses
const i18n = useI18n();
const localePath = useLocalePath();

// seo meta
const title = i18n.t('meta.guides.write.title');

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
          to: 'guides',
          title: i18n.t('guides.create.title')
        }
      ]"
    />

    <!-- header -->
    <page-header>
      <template #actions>
        <back-button to="guides" />
      </template>
    </page-header>

    <v-card>
      <v-card-text>
        <lazy-editor />
      </v-card-text>
    </v-card>
  </div>
</template>
