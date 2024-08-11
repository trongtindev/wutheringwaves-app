<script setup lang="ts">
import { CardPoolType, type IBanner } from '@/interfaces/banner';
import {
  mdiDotsGrid,
  mdiFormatListBulleted,
  mdiStar,
  mdiFilter,
} from '@mdi/js';
import dayjs from 'dayjs';
import JSConfetti from 'js-confetti';
import urlSlug from 'url-slug';
import type { ConveneDocumentConverted } from '~/interfaces/convene';

// uses
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const resources = useResources();
const database = useDatabase();
const account = useAccount();
const importConvene = useImportConvene();

// states
const banners = await resources.getBanners();
const convenes = ref<ConveneDocumentConverted[]>([]);
const filterBanner = ref<IBanner>();
const filterRarity = ref<number[]>([5]);
const displayType = ref<'list' | 'grid'>('grid');
const displayConvenes = ref<ConveneDocumentConverted[]>([]);
const confetti = ref<JSConfetti>();
const showDrawer = ref();

// functions
const initialize = () => {
  if (route.query.addConfetti) {
    confetti.value = new JSConfetti();
    confetti.value.addConfetti();
  }

  loadStatistics();
};

const loadStatistics = () => {
  if (!account.active) return;

  const result = database.convenes
    .find({
      playerId: account.active.playerId,
    })
    .map((e) => e[1]);

  convenes.value = result.map((e) => {
    const newObject: any = e;
    newObject.timeConverted = dayjs(e.time).utcOffset(account.timeOffset);
    return newObject;
  }) as any;

  updateFilter();
};

const updateFilter = () => {
  displayConvenes.value = convenes.value
    .filter((e) => {
      if (filterBanner.value) {
        if (e.cardPoolType !== filterBanner.value.type) {
          return false;
        }
      }
      if (filterRarity.value.length > 0) {
        if (!filterRarity.value.includes(e.qualityLevel)) {
          return false;
        }
      }
      return true;
    })
    .filter((e) => {
      if (filterBanner.value) {
        if (
          filterBanner.value.time &&
          [
            CardPoolType['featured-resonator'],
            CardPoolType['featured-weapon'],
          ].includes(e.cardPoolType)
        ) {
          const timeStart = dayjs(filterBanner.value.time.start)
            .utcOffset(8)
            .add(account.timeOffset - 8, 'hours');
          const timeEnd = dayjs(filterBanner.value.time.end)
            .utcOffset(8)
            .add(account.timeOffset - 8, 'hours');

          return (
            e.timeConverted >= timeStart &&
            e.timeConverted <= timeEnd &&
            filterBanner.value.type == e.cardPoolType
          );
        }
      }
      return true;
    });
};

// events
const onToggleRarity = (rarity: number) => {
  const index = filterRarity.value.findIndex((e) => e === rarity);
  if (index >= 0) {
    filterRarity.value.splice(index, 1);
  } else {
    filterRarity.value.push(rarity);
  }
  updateFilter();
};

const onToggleBanner = (banner: IBanner) => {
  if (filterBanner.value && filterBanner.value.name === banner.name) {
    filterBanner.value = undefined;
  } else {
    filterBanner.value = banner;
  }
};

// changes
watch(
  () => account.active,
  () => loadStatistics(),
);
watch(() => filterBanner.value, updateFilter);
watch(
  () => importConvene.onImported,
  () => loadStatistics(),
);

// lifecycle
onMounted(() => initialize());
onBeforeUnmount(() => confetti.value?.destroyCanvas());

// seo meta
const title = i18n.t('meta.convene.history.title');
const description = i18n.t('meta.convene.history.description');

useAppBar().title = i18n.t('convene.history.title');
useHead({ title: title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/convene-history',
          title: i18n.t('convene.history.title'),
        },
      ]"
    />

    <!-- drawer -->
    <v-navigation-drawer v-model="showDrawer" :width="320" location="left">
      <div class="bg-background pa-2">
        <v-card
          v-for="(item, index) in banners"
          :key="index"
          :class="{ 'mt-2': index > 0 }"
          :color="
            filterBanner && filterBanner.name === item.name
              ? 'primary'
              : undefined
          "
          @click="() => onToggleBanner(item)"
        >
          <v-img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            :alt="`Banner ${item.name}`"
          />

          <v-card-title class="text-body-1">
            {{ item.name }}
          </v-card-title>
        </v-card>
      </div>
    </v-navigation-drawer>

    <client-only>
      <!-- filter -->
      <v-card v-if="convenes.length === 0">
        <v-empty-state
          :title="$t('convene.history.empty')"
          :text="$t('convene.message')"
          :action-text="$t('common.import')"
          @click:action="
            () => router.push(localePath('/convene-history/import'))
          "
        />
      </v-card>

      <v-card v-else>
        <v-card-actions>
          <v-btn
            text="3"
            class="text-rarity3"
            :append-icon="mdiStar"
            :active="filterRarity.includes(3)"
            @click="() => onToggleRarity(3)"
          />

          <v-btn
            text="4"
            class="text-rarity4"
            :append-icon="mdiStar"
            :active="filterRarity.includes(4)"
            @click="() => onToggleRarity(4)"
          />

          <v-btn
            text="5"
            class="text-rarity5"
            :append-icon="mdiStar"
            :active="filterRarity.includes(5)"
            @click="() => onToggleRarity(5)"
          />

          <v-spacer />

          <v-btn
            :active="displayType === 'grid'"
            @click="() => (displayType = 'grid')"
          >
            <v-icon :icon="mdiDotsGrid" />
          </v-btn>

          <v-btn
            :active="displayType === 'list'"
            @click="() => (displayType = 'list')"
          >
            <v-icon :icon="mdiFormatListBulleted" />
          </v-btn>
        </v-card-actions>

        <v-card-text>
          <base-alert
            v-if="displayConvenes.length == 0"
            :text="$t('common.noRecordsFound')"
          />

          <div v-if="displayType === 'list'">
            <v-data-table
              class="border rounded"
              :items="displayConvenes"
              :headers="[
                { title: $t('Time'), width: '30%' },
                { title: $t('Name'), width: '40%' },
                { title: $t('Pity'), width: '15%' },
                { title: $t('common.rarity'), width: '15%' },
              ]"
              item-value="key"
            >
              <template #item="{ item }">
                <tr :class="`bg-linear-rarity${item.qualityLevel}`">
                  <td>
                    {{ item.time }}
                  </td>

                  <td class="d-flex align-center">
                    <v-avatar
                      class="border mr-2"
                      :class="`bg-rarity${item.qualityLevel}`"
                    >
                      <v-img
                        :src="`/${item.resourceType.startsWith('R') ? 'characters' : 'weapons'}/icons/${urlSlug(item.name)}.webp`"
                      />
                    </v-avatar>
                    <span :class="`text-rarity${item.qualityLevel}`">
                      {{ $t(item.name) }}
                    </span>
                  </td>

                  <td>
                    <span
                      v-if="item.qualityLevel >= 4"
                      :style="`color: hsl(${100 - (item.pity / (item.qualityLevel === 5 ? 80 : 10)) * 100}, 100%, 50%);`"
                    >
                      {{ item.pity }}
                    </span>
                    <span v-else>
                      {{ item.pity }}
                    </span>
                  </td>

                  <td>
                    {{ item.qualityLevel }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>

          <!-- grid -->
          <div v-else class="d-flex flex-wrap justify-center">
            <div
              v-for="(element, index) in displayConvenes"
              :key="index"
              class="pa-2 d-flex position-relative"
            >
              <v-badge
                :color="`hsl(${100 - (element.pity / (element.qualityLevel === 5 ? 80 : 10)) * 100}, 100%, 50%)`"
                :content="element.pity"
                location="bottom right"
              >
                <v-avatar
                  :class="`bg-rarity${element.qualityLevel}`"
                  :size="64"
                  :image="`/${element.resourceType.startsWith('R') ? 'characters' : 'weapons'}/icons/${urlSlug(element.name)}.webp`"
                />
              </v-badge>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <div class="mt-2">
        <masonry col-width="minmax(Min(22.5em, 100%), 1fr)">
          <template #default="masonry">
            <convene-history-rank-summary
              :banners="banners"
              :convenes="convenes"
              @on-updated="() => masonry.refreshLayout()"
            />

            <convene-history-banner-summary
              :title="$t('banner.featuredResonator')"
              :type="CardPoolType['featured-resonator']"
              @on-updated="() => masonry.refreshLayout()"
            />

            <convene-history-banner-summary
              :title="$t('banner.featuredWeapon')"
              :type="CardPoolType['featured-weapon']"
              @on-updated="() => masonry.refreshLayout()"
            />

            <convene-history-banner-summary
              :title="$t('banner.standardResonator')"
              :type="CardPoolType['standard-resonator']"
              @on-updated="() => masonry.refreshLayout()"
            />

            <convene-history-banner-summary
              :title="$t('banner.standardWeapon')"
              :type="CardPoolType['standard-weapon']"
              @on-updated="() => masonry.refreshLayout()"
            />

            <lazy-convene-history-chart-summary
              :convenes="convenes"
              @on-updated="() => masonry.refreshLayout()"
            />
          </template>
        </masonry>
      </div>

      <v-fab
        :text="$t('common.selectBanner')"
        :prepend-icon="mdiFilter"
        class="hidden-lg-and-up"
        location="bottom right"
        color="primary"
        app
        appear
        @click="() => (showDrawer = !showDrawer)"
      />
    </client-only>
  </div>
</template>
