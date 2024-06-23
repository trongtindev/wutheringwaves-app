<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import { CardPoolType } from '@/interfaces/banner';
import { toBlob } from 'html-to-image';
import download from 'downloadjs';
import { mdiDownload } from '@mdi/js';
import urlSlug from 'url-slug';

const WIDTH = 1200;
const HEIGHT = 565;
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
const width = ref(1092);
const height = ref(540);
const scaleFactor = ref(0.7);
const state = ref<'' | 'download'>('');
const card = ref<HTMLDivElement>(null as any);
const convenes = ref<ConveneDocument[]>(null as any);
const showUID = ref(true);
const show4Star = ref(true);
const show5Star = ref(true);
const totalPulls = ref(0);

// functions
const initialize = () => {
  database.getInstance().then((db) => {
    db.convenes
      .find({
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
        totalPulls.value = convenes.value.length;
      });
  });
};

const downloadImage = async () => {
  try {
    state.value = 'download';

    // issues: https://github.com/bubkoo/html-to-image/issues/452
    const blob = await Promise.all([
      toBlob(card.value, {
        width: WIDTH,
        height: HEIGHT,
        skipFonts: true
      }),
      new Promise((resolve) => setTimeout(resolve, 500)),
      toBlob(card.value, {
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
  return Array.from(Array(10).keys()).map((e) => {
    return {
      chain: 0
    };
  });

  // return items.value.filter((e) => {
  //   if (primary.value) {
  //     return e.name != primary.value.name;
  //   }
  //   return e;
  // });
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

        <div v-else>
          <div
            style="background-size: cover"
            class="position-relative rounded d-flex"
          >
            <!-- <div :style="`width: ${WIDTH / 3}px`">
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
            </div> -->
          </div>
        </div>
      </v-card-text>
      <v-divider />

      <v-card-text>
        <v-switch
          v-model="showUID"
          :label="$t('convene.cardGenerator.showUID')"
        />
        <v-switch
          v-model="show4Star"
          :label="$t('convene.cardGenerator.show4Star')"
        />
        <v-switch
          v-model="show5Star"
          :label="$t('convene.cardGenerator.show5Star')"
        />
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

    <div
      class="card-wrapper mt-2"
      :style="`width: ${width}px; height: ${height}px;`"
    >
      <div ref="card" class="card-container">
        <!-- background -->
        <!-- <div
          class="card-background position-absolute"
          style="z-index: 0"
          :style="`background-image: url(${backgroundUrl})`"
        ></div> -->

        <!-- left -->
        <!-- <div
          class="z-1 pa-2"
          :style="`width: ${width / 3}px; height: ${height - 25}px;`"
        >
          <div class="border-lg border-rarity5 rounded h-100">ddd</div>
        </div> -->

        <!-- right -->
        <div
          class="z-1 pa-2 position-relative"
          :style="`width: ${width - width / 3}px; height: ${height - 25}px;`"
        >
          <div
            class="border rounded h-100 pa-2 font-weight-bold"
            style="font-size: 30px; background-color: #00000033"
          >
            <!-- totalPulls -->
            <div>
              <v-row>
                <v-col cols="6">
                  {{ $t('convene.rank.totalPull') }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  {{ totalPulls }}
                </v-col>
                <v-col class="d-flex justify-end">
                  <span class="mr-2">{{ $t('convene.rank.top') }}</span>
                  <span>0%</span>
                </v-col>
              </v-row>
            </div>

            <!-- luckWinRateOff -->
            <div>
              <v-row>
                <v-col cols="6">
                  {{ $t('convene.rank.luckWinRateOff') }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center"> 0 </v-col>
                <v-col class="d-flex justify-end">
                  <span class="mr-2">{{ $t('convene.rank.top') }}</span>
                  <span>0%</span>
                </v-col>
              </v-row>
            </div>

            <!-- luck5 -->
            <div class="text-rarity5">
              <v-row>
                <v-col cols="6">
                  {{ $t('convene.rank.luck5') }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center"> 0 </v-col>
                <v-col class="d-flex justify-end">
                  <span class="mr-2">{{ $t('convene.rank.top') }}</span>
                  <span>0%</span>
                </v-col>
              </v-row>
            </div>

            <!-- luck4 -->
            <div class="text-rarity4">
              <v-row>
                <v-col cols="6">
                  {{ $t('convene.rank.luck4') }}
                </v-col>
                <v-col cols="3" class="d-flex justify-center"> 0 </v-col>
                <v-col class="d-flex justify-end">
                  <span class="mr-2">{{ $t('convene.rank.top') }}</span>
                  <span>0%</span>
                </v-col>
              </v-row>
            </div>

            <!-- bottom -->

            <div
              class="position-absolute pl-2 w-100"
              style="bottom: 10px; right: 0"
            >
              <div
                v-for="(element, index) in bottomItems"
                :key="index"
                style="width: 72.8px; height: 72.8px"
              >
                <v-badge>
                  <template #badge>
                    <span class="font-weight-bold">
                      {{ element.chain }}
                    </span>
                  </template>

                  <v-avatar
                    :size="64"
                    class="bg-rarity5 border-rarity5 rounded border"
                    :rounded="true"
                  >
                  </v-avatar>
                </v-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- bottom -->
        <div
          class="z-1 position-absolute"
          style="height: 35px; bottom: 0"
          :style="`width: ${width}px; `"
        >
          <div
            v-if="showUID"
            style="left: 10px; bottom: 5px"
            class="position-absolute"
          >
            UID: {{ account.active }}
          </div>

          <div style="right: 10px; bottom: 5px" class="position-absolute">
            wutheringwaves.app
          </div>
        </div>
        <!-- <div class="bg-green z-1">ok2</div> -->
      </div>
    </div>
  </div>
</template>

<style>
.card-wrapper {
  position: relative;
  /* transform: scale(var(--scale-factor))
    translate(
      calc((1 - var(--scale-factor)) * -800px * 1),
      calc((1 - var(--scale-factor)) * -380px * 1)
    ); */
  /* width: calc(v-bind(scaleFactor) * v-bind(width) * 1px);
  width:
  height: calc(v-bind(scaleFactor) * v-bind(height) * 1px); */
  margin: auto;
}

.card-wrapper * {
  box-shadow: none !important;
  filter: none !important;
}

.card-container {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;

  display: grid;
  grid-template-columns: 364px 1fr;
}

.card-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  border-radius: 5px;
  filter: blur(1px) !important;
}
</style>
