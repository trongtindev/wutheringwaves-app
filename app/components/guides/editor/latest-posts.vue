<script setup lang="ts">
import moment from 'moment';
import type { IListResponse } from '~/interfaces/api';
import type { IPost } from '~/interfaces/post';

const emits = defineEmits<{
  'on-updated': [];
}>();
const { API_URL } = useRuntimeConfig().public;

// uses
const { locale } = useI18n();
const localePath = useLocalePath();

// fetch
const { data: posts } = useFetch<IListResponse<IPost>>('posts', {
  params: {
    limit: 3,
  },
  baseURL: API_URL,
});

// changes
watch(posts, () => emits('on-updated'));
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('guides.latest') }}
    </v-card-title>

    <client-only>
      <template #fallback>
        <v-skeleton-loader type="sentences" />
      </template>

      <v-skeleton-loader v-if="!posts" type="sentences" />
      <v-list v-else-if="posts">
        <v-list-item
          v-for="item in posts.items"
          :key="item.slug"
          :to="localePath(`/posts/${item.slug}`)"
        >
          <v-list-item-title tag="h2">
            <span v-if="item.titleLocalized[locale]">{{
              item.titleLocalized[locale]
            }}</span>
            <span v-else>{{ item.title }}</span>
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ moment(item.createdAt).fromNow() }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </client-only>
  </v-card>
</template>
