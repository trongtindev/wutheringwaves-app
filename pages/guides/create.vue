<script setup lang="ts">
import { mdiPublish } from '@mdi/js';
import urlSlug from 'url-slug';
import type { IPostCategory } from '~/interfaces/posts';

// uses
const i18n = useI18n();
const localePath = useLocalePath();

// states
const allowComments = ref(true);
const customSlug = ref(false);
const slug = ref();
const title = ref();
const categories = ref<IPostCategory[]>();
const language = ref(i18n.locale.value);

// changes
watch(
  () => title.value,
  (value) => {
    slug.value = value ? urlSlug(value) : '';
  }
);

// seo meta
const pageTitle = i18n.t('meta.guides.write.title');

useApp().title = i18n.t('guides.create.title');
useHead({
  title: pageTitle,
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

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <v-text-field v-model="title" :label="$t('common.title')" />
            <editor />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- publish -->
        <v-card>
          <v-card-title>
            {{ $t('common.publish') }}
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-text-field v-model="slug" label="URL" />
          </v-card-text>
          <v-divider />

          <v-card-actions>
            <v-btn :text="$t('common.saveDraft')" />
            <v-spacer />
            <v-btn
              variant="flat"
              :prepend-icon="mdiPublish"
              :text="$t('common.publish')"
            />
          </v-card-actions>
        </v-card>

        <!-- categories -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('common.categories') }}
          </v-card-title>
          <v-divider />

          <v-card-text class="text-center">
            <v-progress-circular :indeterminate="true" />
          </v-card-text>
          <v-divider />
        </v-card>

        <!-- featured image -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('posts.featuredImage') }}
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-responsive :aspect-ratio="18 / 9" class="border rounded" />
          </v-card-text>
          <v-divider />
        </v-card>

        <!-- localization -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('common.localization') }}
          </v-card-title>
          <v-divider />

          <v-card-text class="text-center">
            <v-select
              v-model="language"
              :items="i18n.locales.value"
              item-title="name"
              item-value="code"
              :hide-details="true"
            />
          </v-card-text>
          <v-divider />
        </v-card>

        <!-- discussion -->
        <!-- <v-card class="mt-2">
          <v-card-title>
            {{ $t('posts.discussion') }}
          </v-card-title>
          <v-divider />

          <v-list>
            <v-list-item :title="$t('posts.allowComments')">
              <template #append>
                <v-switch v-model="allowComments" :hide-details="true" />
              </template>
            </v-list-item>
          </v-list>
          <v-divider />
        </v-card> -->
      </v-col>
    </v-row>
  </div>
</template>
