<script setup lang="ts">
// uses
const i18n = useI18n();

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
          title: i18n.t('guides.write.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t('guides.write.title') }}
        </template>

        <template #actions>
          <back-button to="guides" />
        </template>
      </card-title>

      <v-card-text>
        <editor />
      </v-card-text>
    </v-card>
  </div>
</template>
