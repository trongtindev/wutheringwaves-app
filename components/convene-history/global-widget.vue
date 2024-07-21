<script setup lang="ts">
import { CardPoolType } from '~/interfaces/banner';

// define
const emits = defineEmits<{
  (e: 'on-done'): void;
}>();

// uses
const resources = useResources();

// states
const banners = await resources.getBanners();
const activeBanners = banners
  .filter((e) => {
    return (
      e.type === CardPoolType['featured-resonator'] ||
      e.type === CardPoolType['featured-weapon']
    );
  })
  .sort((a, b) => {
    const timeA = new Date(a.time!.start).getTime();
    const timeB = new Date(b.time!.start).getTime();
    return timeB - timeA;
  });
</script>

<template>
  <v-card-text>
    <div v-if="activeBanners.length < 2">
      {{ $t('common.noRecordsFound') }}
    </div>

    <div v-else>
      <v-card>
        <v-responsive :aspect-ratio="16 / 9">
          <nuxt-img
            v-if="activeBanners[0].thumbnail"
            :src="activeBanners[0].thumbnail"
            :alt="activeBanners[0].featuredRare"
            class="w-100"
          />
        </v-responsive>

        <v-card-title class="text-center">
          {{ activeBanners[0].featuredRare }}
        </v-card-title>
      </v-card>

      <v-card class="mt-2">
        <v-responsive :aspect-ratio="16 / 9">
          <nuxt-img
            v-if="activeBanners[1].thumbnail"
            :src="activeBanners[1].thumbnail"
            :alt="activeBanners[1].featuredRare"
            class="w-100"
          />
        </v-responsive>

        <v-card-title class="text-center">
          {{ activeBanners[1].featuredRare }}
        </v-card-title>
      </v-card>
    </div>
  </v-card-text>
</template>
