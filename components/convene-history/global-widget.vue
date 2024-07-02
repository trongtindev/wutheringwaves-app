<script setup lang="ts">
import { CardPoolType, type IBanner } from '~/interfaces/banner';

// define
const emits = defineEmits<{
  (e: 'on-done'): void;
}>();

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
    setTimeout(() => emits('on-done'), 50);
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
        <v-col cols="6">
          <v-card class="fill-height">
            <v-img
              v-if="banners[0].thumbnail"
              :src="banners[0].thumbnail"
              :alt="banners[0].featuredRare"
            >
              <div class="d-flex align-center justify-center h-100">
                <v-chip class="bg-black">0</v-chip>
              </div>
            </v-img>

            <v-card-title class="text-center">
              {{ banners[0].featuredRare }}
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card class="fill-height">
            <v-img
              v-if="banners[1].thumbnail"
              :src="banners[1].thumbnail"
              :alt="banners[1].featuredRare"
            >
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

      <v-alert color="info" :text="$t('convene.global.alert', [0])" />
    </div>
  </v-card-text>
</template>
