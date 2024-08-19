<script setup lang="ts">
import moment from 'moment';
import { CardPoolType } from '~/interfaces/banner';

// define
const emits = defineEmits<{
  (e: 'on-done'): void;
}>();

// uses
const resources = useResources();

// states
const diff = getTimeDifference();
const now = moment().add(diff, 'minute');
const banners = await resources.getBanners();
const activeBanners = banners
  .filter((e) => {
    if (e.time && now.diff(moment(e.time.start)) < 0) {
      return false;
    }
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

// lifecycle
onNuxtReady(() => emits('on-done'));
</script>

<template>
  <v-card-text>
    <div v-if="activeBanners.length < 2">
      {{ $t('common.noRecordsFound') }}
    </div>

    <div v-else>
      <v-card>
        <v-img
          v-if="activeBanners[0].thumbnail"
          :aspect-ratio="16 / 9"
          :src="activeBanners[0].thumbnail"
          :alt="activeBanners[0].featuredRare"
          class="align-end"
        >
          <!-- <v-card-title class="text-center">
            {{ activeBanners[0].featuredRare }}
          </v-card-title> -->
        </v-img>
      </v-card>

      <v-card class="mt-2">
        <v-img
          v-if="activeBanners[1].thumbnail"
          :aspect-ratio="16 / 9"
          :src="activeBanners[1].thumbnail"
          :alt="activeBanners[1].featuredRare"
          class="align-end"
        >
          <!-- <v-card-title class="text-center">
            {{ activeBanners[1].featuredRare }}
          </v-card-title> -->
        </v-img>
      </v-card>
    </div>
  </v-card-text>
</template>
