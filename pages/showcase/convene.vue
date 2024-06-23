<script setup lang="ts">
import { type ConveneDocument } from '@/collections/convene';
import { CardPoolType } from '@/interfaces/banner';
import { toBlob } from 'html-to-image';
import download from 'downloadjs';
import { mdiDownload } from '@mdi/js';
import urlSlug from 'url-slug';

// define
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
        totalPull.value = convenes.value.length;
      });
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
const items = computed(() => {
  return Array.from(Array(14).keys()).map(() => {
    return {
      chain: 0,
      rarity: 5
    };
  });
});

const bestPull = computed(() => {
  return {
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

            <div class="left pa-4">
              <div
                class="border-lg rounded h-100"
                :class="`border-rarity${bestPull.rarity} bg-rarity${bestPull.rarity}`"
              >
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
                <div
                  v-for="(element, index) in items"
                  :key="index"
                  :style="
                    index > 6
                      ? `left: ${72 * (index - 8) + index * 10}px; bottom: 118px`
                      : `left: ${72 * index + index * 10}px; bottom: 36px`
                  "
                  :class="`border-rarity${element.rarity}`"
                  style="width: 72px; height: 72px"
                  cols="2"
                  class="item border rounded-circle position-absolute"
                ></div>
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
                  <span>wutheringwaves.app</span>
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
          {{ CARDS }}
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

  /* width: 100%;
  height: 100%;
  display: grid;
  position: relative;
  display: grid;
  grid-template-columns: 364px 728px; */
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
  height: 100%;

  position: absolute;
  left: 0px;
  top: 0px;
}

.card-container .left .name {
  font-size: 30px;
  margin-bottom: 30px;
}

.card-container .right {
  width: calc(1092px - 364px);
  height: 100%;

  position: absolute;
  left: 364px;
  top: 0px;
}

.card-container .right .top {
  font-weight: bold;
  font-size: 30px;
  padding: 10px;
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
