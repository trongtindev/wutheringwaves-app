<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import { CardPoolType } from '@/interfaces/banner';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { mdiDownload, mdiUpload } from '@mdi/js';
import urlSlug from 'url-slug';

// define
const CARDS = Array.from(Array(25).keys()).map((i) => {
  return {
    id: i + 1
  };
});

// uses
const i18n = useI18n();
const account = useAccount();
const database = useDatabase();

// states
const card = ref();
const state = ref<'' | 'download'>('');
const width = ref(1092);
const height = ref(540);
const totalPull = ref(0);
const luckWinRateOff = ref(0);
const convenes = ref<ConveneDocument[]>(null as any);
const showOptions = ref(false);
const showUID = ref(true);
const show4Star = ref(true);
const show5Star = ref(true);
const background = ref();

// functions
const initialize = () => {
  if (!account.active) {
    setTimeout(initialize, 250);
    return;
  }

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
        totalPull.value = convenes.value.length;
      })
      .catch(console.error);
  });
};

const downloadImage = async () => {
  try {
    state.value = 'download';

    // issues: https://github.com/bubkoo/html-to-image/issues/452
    const blob = await Promise.all([
      toBlob(card.value, {
        width: width.value,
        height: height.value,
        skipFonts: true
      }),
      new Promise((resolve) => setTimeout(resolve, 500)),
      toBlob(card.value, {
        width: width.value,
        height: height.value,
        skipFonts: true
      })
    ]).then((res) => res[2] as Blob);
    saveAs(blob, `${account.active}-convene-history.png`);
  } catch (error) {
    // TODO: handle error
    console.error(error);
    alert(error);
  } finally {
    state.value = '';
  }
};

// computed
const items = computed(() => {
  let output: {
    resourceType: string;
    name: string;
    slug: string;
    chain: number;
    rarity: number;
    items: any[];
  }[] = [];

  if (convenes.value) {
    const filterItems = convenes.value
      .filter((e) => {
        return (
          e.cardPoolType == CardPoolType['featured-resonator'] ||
          e.cardPoolType == CardPoolType['featured-weapon'] ||
          e.cardPoolType == CardPoolType['standard-resonator'] ||
          e.cardPoolType == CardPoolType['standard-weapon']
        );
      })
      .filter((e) => {
        if (!show4Star.value) {
          return e.qualityLevel >= 5;
        }
        return e.qualityLevel >= 4;
      });

    filterItems.forEach((filterItem) => {
      const index = output.findIndex((element) => {
        return element.name == filterItem.name;
      });

      const conveneHistory = convenes.value.filter((e) => {
        return e.cardPoolType == filterItem.cardPoolType;
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

        if (element.name == filterItem.name) {
          items.push(1);
        }
      }

      if (index >= 0) {
        output[index].chain += 1;
      } else {
        output.push({
          resourceType: filterItem.resourceType,
          name: filterItem.name,
          slug: urlSlug(filterItem.name),
          chain: 0,
          rarity: filterItem.qualityLevel,
          items: items
        });
      }
    });
  }

  output.sort((a, b) => b.rarity - a.rarity);
  if (output.length > 14) {
    output = output.slice(0, 14);
  } else if (output.length < 14) {
    Array.from(Array(14 - output.length).keys())
      .map(() => {
        return {
          chain: 0,
          rarity: 0
        };
      })
      .forEach((e) => {
        output.push(e as any);
      });
  }

  return output;
});

const bestPull = computed(() => {
  const match = items.value
    .sort((a, b) => {
      return b.rarity - a.rarity && b.chain - a.chain;
    })
    .find((e) => {
      return e.resourceType && e.resourceType.startsWith('R');
    });
  if (match) return match;

  return {
    slug: null,
    name: 'Unknown',
    chain: 0,
    rarity: 5
  };
});

const backgroundUrl = computed(() => {
  // if (primary.value) {
  //   const card = CARDS.find((e) => e.character == primary.value?.name);
  //   if (card) return `/cards/T_Card${card.id}.png`;
  // }
  if (background.value) {
    return `/cards/T_Card${background.value}.png`;
  }
  return `/cards/T_Card1.png`;
});

const isEmptyCard = computed(() => {
  return convenes.value && convenes.value.length === 0;
});

// lifecycle
onMounted(initialize);
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/showcase',
          title: i18n.t('showcase.title')
        },
        {
          to: '/showcase/convene',
          title: i18n.t('showcase.convene.title')
        }
      ]"
    />

    <client-only>
      <v-alert
        v-if="isEmptyCard"
        color="warning"
        :text="$t('showcase.convene.emptyCard')"
        class="mb-4"
      />

      <div class="card-scroll overflow-x-auto">
        <div
          class="card-wrapper"
          :style="`width: ${width}px; height: ${height}px;`"
        >
          <div ref="card" class="card-container rounded">
            <div
              class="background position-absolute"
              :style="`background-image: url(${backgroundUrl})`"
            ></div>

            <div class="left pt-4 pl-4 pr-4">
              <div
                class="border-lg rounded h-100"
                :class="`border-rarity${bestPull.rarity} bg-rarity${bestPull.rarity}`"
              >
                <v-img
                  v-if="bestPull.slug"
                  :src="`/characters/portraits/${bestPull.slug}.webp`"
                />
                <div
                  class="name position-absolute text-center w-100"
                  style="left: 0px; bottom: 0px"
                >
                  {{ bestPull.name }}
                </div>
              </div>
            </div>

            <div class="right">
              <div class="top">
                <!-- totalPulls -->
                <div>
                  <v-row>
                    <v-col cols="6">
                      {{ $t('convene.rank.totalPull') }}
                    </v-col>
                    <v-col cols="3" class="d-flex justify-center">
                      {{ totalPull }}
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
                      <span>{{ luckWinRateOff }}%</span>
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
              </div>

              <div class="bottom bg-orange">
                <showcase-convene-secondary-character
                  v-for="(element, index) in items"
                  :key="index"
                  :data="element"
                  :index="index"
                />
              </div>
            </div>

            <div class="footer d-flex">
              <v-row :no-gutters="true">
                <v-col class="d-flex align-center pl-2">
                  <span v-if="showUID">
                    UID: <span class="ml-1">{{ account.active }}</span>
                  </span>
                </v-col>
                <v-col class="d-flex justify-end align-center pr-2">
                  <span>astrite.app</span>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-center mt-4">
        <v-btn
          class="mr-1"
          :text="$t('common.options')"
          @click="() => (showOptions = !showOptions)"
        />

        <v-btn
          class="ml-1"
          :loading="state == 'download'"
          :text="$t('common.download')"
          :prepend-icon="mdiDownload"
          color="green"
          @click="() => downloadImage()"
        />
      </div>
    </client-only>

    <v-expand-transition v-if="showOptions">
      <v-card class="mt-4">
        <v-card-text class="ml-4 mr-4">
          <v-switch v-model="showUID" :label="$t('showcase.convene.showUID')" />
          <v-switch
            v-model="show4Star"
            :label="$t('showcase.convene.show4Star')"
          />
          <v-switch
            v-model="show5Star"
            :label="$t('showcase.convene.show5Star')"
          />
        </v-card-text>
        <v-divider />

        <v-card-text>
          <v-row>
            <v-col
              v-for="(element, index) in CARDS"
              :key="index"
              cols="6"
              sm="4"
              lg="2"
            >
              <v-card
                class="border rounded h-100"
                :disabled="background == element.id"
                @click="() => (background = element.id)"
              >
                <v-img :src="`/cards/T_Card${element.id}.png`" />
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" lg="2">
              <v-card
                class="border rounded h-100 d-flex align-center justify-center"
              >
                <v-icon :icon="mdiUpload" />
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<style>
.card-wrapper {
  position: relative;
}

.card-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.card-container .background {
  width: 100%;
  height: 100%;
  background-size: cover;
  border: 2px solid var(--color-rarity5);
  border-radius: 5px;
}

.card-container .left {
  width: 364px;
  height: 505px;

  position: absolute;
  left: 0px;
  top: 0px;
}

.card-container .left .name {
  font-size: 30px;
  margin-bottom: 30px;
}

.card-container .right {
  width: 720px;
  height: 100%;

  position: absolute;
  left: 372px;
  top: 0px;
}

.card-container .right .top {
  font-weight: bold;
  font-size: 30px;
  padding: 15px;
}

.card-container .footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 35px;
}

.card-container .right .bottom {
  position: absolute;
  left: 0px;
  bottom: 0px;
}
</style>
