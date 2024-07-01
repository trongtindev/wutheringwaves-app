<script setup lang="ts">
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import type { ConveneDocument } from '~/collections/convene';
import urlSlug from 'url-slug';
import {
  mdiImport,
  mdiChevronRight,
  mdiGrid,
  mdiViewList,
  mdiDownload
} from '@mdi/js';
import { CardPoolType, type IBanner } from '~/interfaces/banner';

// uses
const resources = useResources();

// states
const banners = ref<IBanner[]>([]);

// functions
const initialize = () => {
  resources.getBanners().then((result) => {
    banners.value = result
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
  });
};

// lifecycle
onMounted(initialize);
</script>

<template>
  <v-card-text>
    <div v-if="banners.length < 2">
      {{ $t('common.noRecordsFound') }}
    </div>

    <div v-else>
      <v-row class="mb-2">
        <v-col>
          <v-card class="fill-height">
            <v-img v-if="banners[0].thumbnail" :src="banners[0].thumbnail">
              <div class="d-flex align-center justify-center h-100">
                <v-chip class="bg-black">0</v-chip>
              </div>
            </v-img>

            <v-card-title class="text-center">
              {{ banners[0].featuredRare }}
            </v-card-title>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="fill-height">
            <v-img v-if="banners[1].thumbnail" :src="banners[1].thumbnail">
              <div class="d-flex align-center justify-center h-100">
                <v-chip class="bg-black">0</v-chip>
              </div>
            </v-img>

            <v-card-title class="text-center">
              {{ banners[1].featuredRare }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <v-alert color="info" :text="$t('convene.global.message', [0])" />
    </div>
  </v-card-text>
</template>
