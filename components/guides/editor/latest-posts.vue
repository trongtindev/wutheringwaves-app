<script setup lang="ts">
import dayjs from 'dayjs';
import type { IListResponse } from '~/interfaces/api';
import type { IPost } from '~/interfaces/post';

const { API_URL } = useRuntimeConfig().public;

// uses
const api = useApi();
const { locale } = useI18n();
const localePath = useLocalePath();

// fetch
const { data: posts, error } = useFetch<IListResponse<IPost>>('posts', {
  params: {
    limit: 3,
  },
  baseURL: API_URL,
});
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('guides.latest') }}
    </v-card-title>

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
          {{ dayjs(item.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
