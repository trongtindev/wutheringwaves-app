<script setup lang="ts">
import type { ConveneDocument } from '@/collections/convene';
import { CardPoolType, type IBanner } from '@/interfaces/banner';
import { mdiImport, mdiChevronRight } from '@mdi/js';

// uses
const i18n = useI18n();
const localePath = useLocalePath();
const resources = useResources();
const database = useDatabase();
const account = useAccount();

// states
const banners = await resources.banners();
const convenes = ref<ConveneDocument[]>();
const filterBanner = ref<IBanner | null>(null);

// computed
const convenesFiltered = computed(() => {
  return (convenes.value || [])
    .filter((e) => {
      if (filterBanner.value) {
        return e.cardPoolType === filterBanner.value.type;
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
    });
});

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
      })
      .catch(console.error);
  });
};

// changes
watch(
  () => account.active,
  () => initialize()
);

const title = i18n.t('convene.history.title');
const description = i18n.t('meta.convene.history.description');

// lifecycle
if (import.meta.client) {
  onMounted(() => initialize());
}

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
      <v-card-title>
        <v-row>
          <v-col class="d-flex align-center">
            {{ $t('convene.history.title') }} ({{ totalPulls }})
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <v-btn
              :text="$t('common.import')"
              :append-icon="mdiImport"
              :to="localePath('/convene-history/import')"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <div class="mb-4">
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
        </div>

        <div v-if="!convenes" class="text-center">
          <v-progress-circular :indeterminate="true" />
        </div>

        <v-alert
          v-else-if="convenes.length === 0"
          type="info"
          :text="$t('You currently have no Convene History.')"
        />

        <v-data-table
          v-else
          class="border rounded"
          :items="convenesFiltered"
          :headers="[
            {
              title: $t('Time'),
              align: 'center',
              key: 'time',
              width: '30%'
            },
            { title: $t('Name'), key: 'name', align: 'center', width: '30%' },
            {
              title: $t('Type'),
              key: 'resourceType',
              align: 'center',
              width: '20%',
              value: (item) => i18n.t(item.resourceType)
            },
            {
              title: $t('Rarity'),
              key: 'rarity',
              align: 'center',
              value: (item) => item.qualityLevel,
              width: '20%'
            }
          ]"
          item-value="key"
        />
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
