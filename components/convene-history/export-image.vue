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

// define
const props = defineProps<{
  items: ConveneDocument[];
}>();

const emits = defineEmits<{
  (e: 'on-close'): void;
}>();

// uses
const account = useAccount();

// states
const type = ref<'list' | 'grid'>('list');
const state = ref<'' | 'download'>('');
const listElement = ref();

// functions
const downloadImage = async () => {
  try {
    state.value = 'download';
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await toBlob(listElement.value, {});
    if (data) {
      saveAs(data, `${account.active}_history.png`);
    }
  } catch (error) {
    alert(error);
    console.error(error);
  } finally {
    state.value = '';
  }
};
</script>

<template>
  <v-card>
    <card-title>
      <template #title>
        {{ $t('common.exportAsImage') }}
      </template>
    </card-title>

    <v-card-text>
      <v-sheet class="w-100 border rounded pa-1">
        <v-tabs v-model="type" fixed-tabs>
          <v-tab value="list">
            <v-icon :icon="mdiViewList" />
          </v-tab>
          <v-tab value="grid">
            <v-icon :icon="mdiGrid" />
          </v-tab>
        </v-tabs>
      </v-sheet>

      <div ref="listElement">
        <v-table>
          <thead>
            <tr>
              <td style="width: 50%">
                {{ $t('common.name') }}
              </td>
              <td style="width: 10%">
                {{ $t('common.pity') }}
              </td>
              <td style="width: 40%">
                {{ $t('common.time') }}
              </td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(element, index) in props.items" :key="index">
              <td>
                <v-avatar
                  class="border mr-2"
                  :class="`bg-rarity${element.qualityLevel}`"
                >
                  <v-img
                    :src="`/${element.resourceType.startsWith('R') ? 'characters' : 'weapons'}/icons/${urlSlug(element.name)}.webp`"
                  />
                </v-avatar>
                <span :class="`text-rarity${element.qualityLevel}`">
                  {{ $t(element.name) }}
                </span>
              </td>
              <td>{{ element.pity }}</td>
              <td>{{ element.time }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        :text="$t('common.downloadImage')"
        :prepend-icon="mdiDownload"
        @click="() => downloadImage()"
      />
    </v-card-actions>
  </v-card>
</template>
