<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import { CardPoolType } from '@/interfaces/banner';
import { toBlob } from 'html-to-image';
import download from 'downloadjs';
import { mdiDownload } from '@mdi/js';
import urlSlug from 'url-slug';

const WIDTH = 728;
const HEIGHT = 360;
const CARDS = Array.from(Array(25).keys())
  .map((i) => {
    return {
      id: i + 1
    };
  })
  .map((e) => {
    let character: string | undefined = undefined;
    switch (e.id) {
      case 3:
        character = 'Calcharo';
        break;

      case 5:
        character = 'Jiyan';
        break;

      case 7:
        character = 'Verina';
        break;

      case 16:
        character = 'Lingyang';
        break;

      case 19:
        character = 'Yinlin';
        break;
    }

    return {
      ...e,
      character
    };
  });

// uses
const app = useApp();
const i18n = useI18n();
const account = useAccount();
const database = useDatabase();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

// states
const state = ref<'' | 'download'>('');
const card = ref<HTMLDivElement>(null as any);
const convenes = ref<ConveneDocument[]>(null as any);

// functions
const initialize = () => {
  if (!database.isInitialized) {
    setTimeout(() => initialize(), 250);
    return;
  }

  database
    .getInstance()
    .convenes.find({
      selector: {
        playerId: account.active
      }
    })
    .sort({
      createdAt: 'desc'
    })
    .exec()
    .then((result) => {
      convenes.value = result as any;
    });
};

const downloadImage = async () => {
  try {
    state.value = 'download';

    // issues: https://github.com/bubkoo/html-to-image/issues/452
    const blob = await Promise.all([
      toBlob(card.value, {
        pixelRatio: 4,
        width: WIDTH,
        height: HEIGHT,
        skipFonts: true
      }),
      new Promise((resolve) => setTimeout(resolve, 500)),
      toBlob(card.value, {
        pixelRatio: 4,
        width: WIDTH,
        height: HEIGHT,
        skipFonts: true
      })
    ]).then((res) => res[2] as Blob);
    download(blob, `${account.active}-convene-history.png`);
  } catch (error) {
    // TODO: handle error
    console.error(error);
    alert(error);
  } finally {
    state.value = '';
  }
};

// computed
const backgroundUrl = computed(() => {
  if (primary.value) {
    const card = CARDS.find((e) => e.character == primary.value?.name);
    if (card) return `/cards/T_Card${card.id}.png`;
  }
  return `/cards/T_Card1.png`;
});

const cardPolygonUrl = computed(() => {
  if (primary.value) {
    const card = CARDS.find((e) => e.character == primary.value?.name);
    if (card) return `/cards/T_CardPolygon_${card.id}.png`;
  }
  return `/cards/T_CardPolygon_1.png`;
});

const items = computed(() => {
  if (convenes.value) {
    const output: {
      type: number;
      name: string;
      slug: string;
      chain: number;
      items: any[];
    }[] = [];
    const resonatorItems = convenes.value.filter((e) => {
      return (
        e.cardPoolType == CardPoolType['featured-resonator'] ||
        e.cardPoolType == CardPoolType['featured-weapon'] ||
        e.cardPoolType == CardPoolType['standard-resonator'] ||
        e.cardPoolType == CardPoolType['standard-weapon']
      );
    });
    const fiveStarItems = resonatorItems.filter((e) => e.qualityLevel === 5);

    fiveStarItems.forEach((fiveStarItem) => {
      const index = output.findIndex((element) => {
        return element.name == fiveStarItem.name;
      });

      const conveneHistory = convenes.value.filter((e) => {
        return e.cardPoolType == fiveStarItem.cardPoolType;
      });

      const items: number[] = [];
      for (let i = 0; i < conveneHistory.length; i += 1) {
        const element = conveneHistory[i];
        if (element.qualityLevel < 5) {
          if (items.length > 0) {
            items[items.length - 1] += 1;
          }
          continue;
        }

        if (element.name == fiveStarItem.name) {
          items.push(1);
        }
      }

      if (index >= 0) {
        output[index].chain += 1;
      } else {
        output.push({
          type: fiveStarItem.cardPoolType,
          name: fiveStarItem.name,
          // TODO: maybe load slug from resources
          slug: urlSlug(fiveStarItem.name),
          chain: 0,
          items: items
        });
      }
    });

    // .sort((a, b) => b.chain - a.chain)
    return output;
  }
  return [];
});

const primary = computed(() => {
  const character = items.value
    .sort((a, b) => {
      return b.chain - a.chain;
    })
    .find((e) => {
      return (
        e.type == CardPoolType['featured-resonator'] ||
        e.type == CardPoolType['standard-resonator']
      );
    });
  if (character) return character;

  const weapon = items.value
    .sort((a, b) => {
      return b.chain - a.chain;
    })
    .find((e) => {
      return (
        e.type == CardPoolType['featured-weapon'] ||
        e.type == CardPoolType['standard-weapon']
      );
    });
  if (weapon) return weapon;
});

const bottomItems = computed(() => {
  return items.value.filter((e) => {
    if (primary.value) {
      return e.name != primary.value.name;
    }
    return e;
  });
});

const canDownload = computed(() => {
  return typeof primary.value != 'undefined';
});

// changes
watch(
  () => account.active,
  () => initialize()
);

// lifecycle
if (import.meta.client) {
  onMounted(() => initialize());
}

// initialize
const title = i18n.t('meta.convene.cardGenerator.title');
const description = i18n.t('meta.convene.cardGenerator.description');

useHead({ title });

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title')
        },
        {
          to: '/convene-history/card-generator',
          title: i18n.t('convene.cardGenerator.title')
        }
      ]"
    />

    <v-card class="mt-2">
      <card-title>
        <template #title>
          {{ $t('convene.cardGenerator.title') }}
        </template>

        <template #actions>
          <back-button :to="localePath('/convene-history')" />
        </template>
      </card-title>

      <v-card-text>
        <div v-if="!convenes" class="text-center">
          <v-progress-circular :indeterminate="true" />
        </div>

        <div v-else-if="!primary">
          <v-alert color="warning" :text="$t('common.notEnoughData')" />
        </div>

        <div v-else class="d-flex justify-center position-relative">
          <div
            ref="card"
            style="background-size: cover"
            :style="`width: ${WIDTH}px; height:${HEIGHT}px; background-image: url(${backgroundUrl}) `"
            class="position-relative rounded d-flex"
          >
            <div :style="`width: ${WIDTH / 3}px`">
              <v-img
                :src="cardPolygonUrl"
                class="d-flex align-center justify-center"
              >
                <v-img
                  v-if="
                    primary.type == CardPoolType['featured-resonator'] ||
                    primary.type == CardPoolType['standard-resonator']
                  "
                  :src="`/characters/portraits/${primary.slug}.webp`"
                />

                <div
                  class="position-absolute"
                  style="right: 25px; bottom: 25px"
                >
                  <v-sheet
                    class="font-weight-bold rounded pl-2 pr-2 pt-1 pb-1 bg-info"
                  >
                    {{ primary.chain }}
                  </v-sheet>
                </div>
              </v-img>
            </div>
            <div :style="`width: ${WIDTH - WIDTH / 3}px`">
              <div class="pt-2 pb-2 pl-2">
                <div
                  v-for="(element, index) in items"
                  :key="index"
                  :class="{
                    'mt-2': index > 0
                  }"
                >
                  <v-row>
                    <v-col cols="4" class="text-rarity5">
                      {{ element.name }}
                    </v-col>

                    <v-col cols="8">
                      <v-chip
                        v-for="(pity, j) in element.items"
                        :key="j"
                        class="ml-2 font-weight-bold"
                      >
                        <span
                          :style="`color: hsl(${100 - (pity / 80) * 100}, 100%, 50%);`"
                        >
                          {{ pity }}
                        </span>
                      </v-chip>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div
                class="position-absolute pl-2"
                style="bottom: 0px"
                :style="`left: ${WIDTH / 3}px;`"
              >
                <v-badge v-for="(element, index) in bottomItems" :key="index">
                  <template #badge>
                    <span class="font-weight-bold">
                      {{ element.chain }}
                    </span>
                  </template>

                  <v-avatar
                    :size="64"
                    :class="{
                      'ml-2': index > 0
                    }"
                    class="bg-rarity5 border-rarity5 rounded border"
                    :rounded="true"
                  >
                    <v-img
                      v-if="
                        element.type == CardPoolType['featured-resonator'] ||
                        element.type == CardPoolType['standard-resonator']
                      "
                      :src="`/characters/icons/${element.slug}.webp`"
                    />
                    <v-img
                      v-else-if="
                        element.type == CardPoolType['featured-weapon'] ||
                        element.type == CardPoolType['standard-weapon']
                      "
                      :src="`/weapons/icons/${element.slug}.webp`"
                    />
                  </v-avatar>
                </v-badge>
              </div>
            </div>

            <div style="right: 10px; bottom: 5px" class="position-absolute">
              www.WutheringWaves.app
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex justify-end">
        <v-btn
          :disabled="!canDownload || state != ''"
          :loading="state == 'download'"
          :text="$t('common.download')"
          :prepend-icon="mdiDownload"
          @click="() => downloadImage()"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>
