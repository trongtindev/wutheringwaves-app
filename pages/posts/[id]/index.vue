<script lang="ts" setup>
import dayjs from 'dayjs';
import { mdiDotsVertical, mdiFlag, mdiTrashCan } from '@mdi/js';
import type { IListResponse } from '~/interfaces/api';
import type { IPost } from '~/interfaces/post';

// define
const { SITE_URL } = useRuntimeConfig().public;

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const device = useDevice();
const headers = useRequestHeaders(['If-Modified-Since']);
const event = useRequestEvent();
const { API_URL } = useRuntimeConfig().public;
const localePath = useLocalePath();
const auth = useAuth();

// fetch
const { data: item, status } = await api.get<IPost>(
  `posts/${route.params.id}`,
  {
    validateStatus: () => true
  }
);
if (status != 200) throw createError({ statusCode: status });

const { data: relatedItems } = useFetch<IListResponse<IPost>>(
  `${API_URL}/posts/${item.id}/related`,
  {
    params: {
      limit: 5
    }
  }
);

// events
const onPressedReport = () => {};
const onPressedDelete = () => {};

// computed
const titleLocalized = computed(() => {
  if (item.titleLocalized[i18n.locale.value]) {
    return item.titleLocalized[i18n.locale.value];
  }
  return item.title;
});

const descriptionLocalized = computed(() => {
  if (item.descriptionLocalized[i18n.locale.value]) {
    return item.descriptionLocalized[i18n.locale.value];
  }
  return item.description;
});

const contentLocalized = computed(() => {
  if (item.contentLocalized[i18n.locale.value]) {
    return item.contentLocalized[i18n.locale.value];
  }
  return item.content;
});

const thumbnailUrl = computed(() => {
  if (item.thumbnail) {
    return item.thumbnail.url;
  }
  return null;
});

const lastUpdated = computed(() => {
  return dayjs(item.updatedAt).format('HH:mm - YYYY/MM/DD');
});

// lifecycle
onMounted(() => {
  if (!device.isCrawler) {
    api.post(`posts/${item.id}/views`);
  }
});

// seo meta
useApp().title = i18n.t('guides.title');
useHead({ title: titleLocalized.value });
useSeoMeta({
  ogType: 'article',
  ogTitle: titleLocalized.value,
  description: descriptionLocalized.value,
  ogDescription: descriptionLocalized.value,
  ogImage: thumbnailUrl.value,
  articlePublishedTime: item.createdAt,
  articleModifiedTime: item.updatedAt
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'Article',
  // author: {
  //   name: data.user.name,
  //   image: {
  //     '@type': 'ImageObject',
  //     url: data.user.photoUrl
  //   }
  // },
  headline: titleLocalized.value,
  thumbnailUrl: thumbnailUrl.value || undefined,
  dateCreated: item.createdAt,
  datePublished: item.createdAt,
  dateModified: item.updatedAt
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: thumbnailUrl.value || undefined,
  license: `${SITE_URL}/license`,
  acquireLicensePage: `${SITE_URL}/license/#how-to-use`,
  creditText: 'WutheringWaves.app',
  creator: {
    '@type': 'Person',
    name: item.user.name
  },
  copyrightNotice: item.user.name
});
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: useRuntimeConfig().public.SITE_URL
    },
    { '@type': 'ListItem', position: 2, name: i18n.t('weapons.title') }
  ]
});

// https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget#if-modified-since
if (headers['if-modified-since']) {
  const modifiedSince = new Date(headers['if-modified-since']);
  const modifiedTime = new Date(item.updatedAt);
  if (modifiedSince.getTime() >= modifiedTime.getTime()) {
    setResponseStatus(event!, 304);
  }
}
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <!-- main -->
        <v-card>
          <!-- thumbnail -->
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
            />
          </div>

          <v-card-item>
            <v-card-title class="text-wrap" tag="h1">
              {{ titleLocalized }}
            </v-card-title>
            <v-card-subtitle tag="h2">
              {{ $t('common.lastUpdatedOn', { time: lastUpdated }) }}
            </v-card-subtitle>

            <template #append>
              <client-only>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      variant="text"
                      v-bind="props"
                      :icon="mdiDotsVertical"
                    />
                  </template>

                  <v-list :elevation="3">
                    <v-list-item
                      :title="$t('guides.actions.edit')"
                      :disabled="!auth.isSignedIn"
                      :to="localePath(`/guides/editor/?id=${item.id}`)"
                      @click="() => onPressedReport()"
                    />
                    <v-divider />

                    <v-list-item
                      class="text-warning"
                      :title="$t('guides.actions.report')"
                      :append-icon="mdiFlag"
                      :disabled="!auth.isSignedIn"
                      @click="() => onPressedReport()"
                    />
                    <v-list-item
                      class="text-error"
                      :title="$t('guides.actions.delete')"
                      :append-icon="mdiTrashCan"
                      @click="() => onPressedDelete()"
                    />
                  </v-list>
                </v-menu>
              </client-only>
            </template>
          </v-card-item>

          <v-card-text>
            <div class="tiptap" :innerHTML="contentLocalized"></div>
          </v-card-text>
        </v-card>

        <!-- author -->
        <v-card class="mt-2 pt-2 pb-2">
          <v-list-item :title="item.user.name">
            <template #prepend>
              <v-avatar :image="item.user.photoUrl" />
            </template>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- relate -->
        <v-card>
          <v-card-title>
            {{ $t('guides.related') }}
          </v-card-title>

          <div v-if="!relatedItems">
            <v-skeleton-loader
              v-for="index in 5"
              :key="index"
              type="list-item-two-line"
            />
          </div>

          <v-list v-else-if="relatedItems.total > 0">
            <v-list-item
              v-for="(element, index) in relatedItems.items"
              :key="index"
              :to="localePath(`/posts/${element.slug}`)"
            >
              <v-list-item-title tag="h2">
                {{ element.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <span>
                  {{ dayjs(element.createdAt).format('HH:mm - YYYY/MM/DD') }}
                </span>
                <span> · </span>
                <span> {{ element.views }} {{ $t('common.views') }} </span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-card-text v-else>
            {{ $t('common.noRecordsFound') }}
          </v-card-text>
        </v-card>

        <!-- latest -->
        <!-- <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.latest') }}
          </v-card-title>
        </v-card> -->
      </v-col>
    </v-row>

    <!-- comments -->
    <comments class="mt-2" :channel="`post.${item.id}`" />
  </div>
</template>
