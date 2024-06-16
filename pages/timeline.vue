<script setup lang="ts">
// uses
const i18n = useI18n();

// states
const calendar = ref();
const events = ref([]);

// lifecycle
onMounted(() => {});

// seo meta
const title = i18n.t('meta.timeline.title');
const description = i18n.t('meta.timeline.description');

useHead({ title });

useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/timeline',
          title: i18n.t('timeline.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ $t('timeline.title') }}
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card>
        <client-only>
          <!-- <v-calendar ref="calendar" type="month" :events="events" /> -->
        </client-only>
      </v-card>
    </v-card>
  </div>
</template>
