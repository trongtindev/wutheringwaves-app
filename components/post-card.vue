<script lang="ts" setup>
import moment from 'moment';
import type { IPost } from '~/interfaces/post';

// define
defineProps<{
  item: IPost;
}>();

// uses
const localePath = useLocalePath();
</script>

<template>
  <v-card
    :key="item.id"
    class="fill-height"
    :to="localePath(`/posts/${item.slug}`)"
  >
    <base-image
      class="border-b"
      :aspect-ratio="1.91 / 1"
      :src="item.thumbnail ? item.thumbnail.url : undefined"
      :cover="true"
    />

    <!-- categories -->
    <div class="d-flex flex-wrap ga-2 mt-4 pl-4 pr-4">
      <v-chip
        v-for="(category, index) in item.categories"
        :key="index"
        :text="category.name"
        :to="localePath(`/guides/${category.slug}`)"
        @mousedown.stop
        @mouseup.stop
        @click.stop
      />
    </div>

    <v-card-item>
      <div class="text-body-1 line-clamp-2 mb-2" tag="h2">
        {{ item.title }}
      </div>

      <v-card-subtitle class="text-caption">
        <client-only>
          <template #fallback> 0000/00/00 00:00 </template>

          <span>
            {{ moment(item.createdAt).format('HH:mm - YYYY/MM/DD') }}
          </span>
          <span> · </span>
          <span> {{ item.views }} {{ $t('common.views') }} </span>
        </client-only>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
