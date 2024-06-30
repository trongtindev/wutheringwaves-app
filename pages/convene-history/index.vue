<script setup lang="ts">
import type { ConveneDocument } from '@/collections/convene';
import { CardPoolType, type IBanner } from '@/interfaces/banner';
import { mdiImport, mdiChevronRight, mdiGrid, mdiViewList } from '@mdi/js';

// uses
const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// states
const banners = await resources.banners();
const convenes = ref<ConveneDocument[]>([]);
const filterBanner = ref<IBanner | null>(null);
const filterRarity = ref<number[]>([5, 4, 3]);
const displayType = ref<'list' | 'grid'>('list');
const displayConvenes = ref<{ pity: number; doc: ConveneDocument }[]>([]);

// computed
const totalPulls = computed(() => {
  return (convenes.value || []).length;
});

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
        // TODO: fixme
        convenes.value = result as any;
        updateFilter();
      })
      .catch(console.error);
  });
};

const updateFilter = () => {
  displayConvenes.value = convenes.value
    .filter((e) => {
      if (filterBanner.value) {
        return e.cardPoolType === filterBanner.value.type;
      }
      if (filterRarity.value) {
        return filterRarity.value.includes(e.qualityLevel);
      }
      return true;
    })
    .filter((e) => {
      if (filterBanner.value) {
        if (
          filterBanner.value.time &&
          [
            CardPoolType['featured-resonator'],
            CardPoolType['featured-weapon']
          ].includes(e.cardPoolType)
        ) {
          const time = dayjs(e.time);
          return (
            time >= dayjs(filterBanner.value.time.start) &&
            time <= dayjs(filterBanner.value.time.end) &&
            filterBanner.value.type == e.cardPoolType
          );
        }
      }
      return true;
    })
    .map((e) => {
      return {
        pity: 0,
        doc: e
      };
    });

  // console.log(displayConvenes.value);
  // let pity = 0;
  // let current = -1;
  // for (let i = 0; i < convenes.value.length; i += 1) {
  //   const isEnd = i >= convenes.value.length - 1;
  //   if (convenes.value[i].qualityLevel >= 4 || isEnd) {
  //     if (
  //       current >= 0 &&
  //       (convenes.value[i].qualityLevel >=
  //         displayConvenes.value[current].doc.qualityLevel ||
  //         isEnd)
  //     ) {
  //       console.log(displayConvenes.value[current].doc.name, pity);
  //       displayConvenes.value[current].pity = pity;

  //       // reset
  //       pity = 1;
  //     }

  //     for (let j = 0; j < displayConvenes.value.length; j += 1) {
  //       if (
  //         displayConvenes.value[j].doc.name === convenes.value[i].name &&
  //         displayConvenes.value[j].doc.time === convenes.value[i].time
  //       ) {
  //         current = j;
  //         console.log(displayConvenes.value[current].doc.name);
  //         break;
  //       }
  //     }
  //   } else if (current >= 0) {
  //     pity += 1;
  //   }
  // }
};

// changes
watch(
  () => account.active,
  () => initialize()
);
watch(() => filterBanner.value, updateFilter);
watch(() => filterRarity.value, updateFilter);

// lifecycle
onMounted(() => initialize());

// seo meta
const title = i18n.t('convene.history.title');
const description = i18n.t('meta.convene.history.description');

useHead({
  title: title,
  meta: [{}]
});
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ $t('convene.history.title') }} ({{ totalPulls }})
        </template>

        <template #actions>
          <v-btn-toggle
            v-model="displayType"
            color="primary"
            variant="outlined"
          >
            <v-btn :icon="mdiViewList" value="list" />
            <v-btn :icon="mdiGrid" value="grid" />
          </v-btn-toggle>

          <v-btn
            :text="$t('common.import')"
            :append-icon="mdiImport"
            :to="localePath('/convene-history/import')"
          />
        </template>
      </card-title>

      <v-card-text>
        <div class="mb-4">
          <v-row>
            <v-col cols="12" md="8">
              <v-select
                v-model="filterBanner"
                :placeholder="$t('Select banner')"
                :items="banners"
                :return-object="true"
                :item-title="
                  (e) => {
                    return e.name[i18n.locale.value] || e.name.en;
                  }
                "
                :clearable="true"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="filterRarity"
                :label="$t('common.rarity')"
                :items="[5, 4, 3]"
                :multiple="true"
              />
            </v-col>
          </v-row>
        </div>

        <v-alert
          v-if="convenes.length === 0"
          type="info"
          :text="$t('You currently have no Convene History.')"
        />

        <v-data-table
          v-else
          class="border rounded"
          :items="displayConvenes"
          :headers="[
            {
              title: $t('Time'),
              align: 'center',
              key: 'time',
              width: '20%'
            },
            { title: $t('Pity'), align: 'center', width: '10%' },
            { title: $t('Name'), align: 'center', width: '30%' },
            {
              title: $t('Type'),
              key: 'resourceType',
              align: 'center',
              width: '20%'
            },
            {
              title: $t('Rarity'),
              key: 'rarity',
              align: 'center',
              width: '20%'
            }
          ]"
          item-value="key"
        >
          <template #item="{ item }">
            <tr :class="`bg-linear-rarity${item.doc.qualityLevel}`">
              <td class="text-center">
                {{ item.doc.time }}
              </td>
              <td class="text-center">
                <span
                  v-if="item.doc.qualityLevel >= 4"
                  :style="`color: hsl(${100 - (item.pity / (item.doc.qualityLevel === 5 ? 80 : 10)) * 100}, 100%, 50%);`"
                >
                  {{ item.pity }}
                </span>
                <span v-else>
                  {{ item.pity }}
                </span>
              </td>
              <td class="text-center">
                <span :class="`text-rarity${item.doc.qualityLevel}`">
                  {{ $t(item.doc.name) }}
                </span>
              </td>
              <td class="text-center">
                [{{ item.doc.cardPoolType }}]
                {{ $t(item.doc.resourceType) }}
              </td>
              <td class="text-center">
                {{ item.doc.qualityLevel }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <div class="mt-2">
      <v-row>
        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Featured resonator')"
            :type="CardPoolType['featured-resonator']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Featured weapon')"
            :type="CardPoolType['featured-weapon']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Standard resonator')"
            :type="CardPoolType['standard-resonator']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <convene-history-banner-summary
            :title="$t('Standard weapon')"
            :type="CardPoolType['standard-weapon']"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('convene.rank.title') }}
            </v-card-title>
            <v-divider />

            <v-card-text>
              <!-- Total pulls -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.totalPull') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.more', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness Win Rate -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luckWinRateOff') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness 5★ -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luck5') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center text-legendary">
                      <div class="mr-2">
                        {{ $t('Top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>

              <!-- Luckiness 4★ -->
              <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('convene.rank.luck4') }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ $t('convene.rank.lessLuck', { percentage: 0 }) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center text-rare">
                      <div class="mr-2">
                        {{ $t('convene.rank.top') }}
                      </div>
                      <div class="text-h6 font-weight-bold">0%</div>
                    </div>
                  </template>
                </v-list-item>
              </v-sheet>
            </v-card-text>
            <v-divider />

            <v-card-actions class="d-flex align-center justify-center">
              <div class="d-flex align-center flex-column">
                <v-btn-toggle variant="outlined" divided>
                  <v-btn :text="$t('Resonator')" />
                  <v-btn :text="$t('Weapon')" />
                  <v-btn :text="$t('Standard')" />
                </v-btn-toggle>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card :to="localePath('/convene-history/global')">
            <v-card-title>
              <v-row>
                <v-col>
                  {{ $t('convene.global.title') }}
                </v-col>

                <v-col class="d-flex justify-end align-center">
                  <v-icon :icon="mdiChevronRight" :size="24" />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>

          <v-card :to="localePath('/showcase/convene')" class="mt-2">
            <v-card-title>
              <v-row>
                <v-col>
                  {{ $t('showcase.convene.title') }}
                </v-col>

                <v-col class="d-flex justify-end align-center">
                  <v-icon :icon="mdiChevronRight" :size="24" />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style>
.bg-linear-rarity5 {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(185, 129, 46, 0.55) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.bg-linear-rarity4 {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(173, 118, 176, 0.55) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
