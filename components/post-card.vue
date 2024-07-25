<script lang="ts" setup>
import dayjs from 'dayjs';
import type { IPost } from '~/interfaces/post';

// define
defineProps<{
  item: IPost;
}>();

// uses
const localePath = useLocalePath();
</script>

<template>
  <v-card :to="localePath(`/guides/${item.slug}`)">
    <base-image
      :aspect-ratio="1.91 / 1"
      :src="item.thumbnail ? item.thumbnail.url : undefined"
      :cover="true"
    />

    <v-card-item>
      <v-card-title tag="h2">
        {{ item.title }}
      </v-card-title>

      <v-card-subtitle>
        <client-only>
          <template #fallback> 0000/00/00 00:00 </template>

          {{ dayjs(item.createdAt).fromNow() }}
        </client-only>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
