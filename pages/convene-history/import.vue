<script setup lang="ts">
import { mdiCancel } from '@mdi/js';

// uses
const api = useApi();
const i18n = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const account = useAccount();
const database = useDatabase();
const { isIos, isAndroid } = useDevice();
const sidebar = useSidebar();
const resources = useResources();

// states
const state = ref<'' | 'import'>('');
const method = ref<'pc' | 'android' | 'ios'>('pc');
const importState = ref();
const conveneHistoryUrl = ref();

// events
const onImport = async (url: string) => {
  try {
    resetState();
    state.value = 'import';

    const response = await api.getInstance().post<{
      playerId: number;
      items: {
        time: string;
        name: string;
        qualityLevel: number;
        cardPoolType: number;
        resourceType: string;
      }[];
      total: number;
    }>('/convenes/import', {
      url,
      userAgent: navigator.userAgent
    });

    // initial account
    const playerId = response.data.playerId.toString();
    await account.upsert(playerId);
    if (account.active != playerId) {
      account.active = playerId;
    }

    // save convene history url
    await account.setConveneHistoryUrl(url);

    // get database instance
    const db = await database.getInstance();

    // remove previous history
    const items = await db.convenes.find().exec();
    await db.convenes.bulkRemove(items.map((e) => e._id));

    // data calculator
    const banners = await resources.getBanners();
    const conveneWrites = response.data.items.map((e, i) => {
      let pity = 1;
      let win = false;

      // calc pity
      if (response.data.items[i].qualityLevel >= 4) {
        for (let j = i + 1; j < response.data.items.length; j += 1) {
          if (
            response.data.items[j].cardPoolType !==
            response.data.items[i].cardPoolType
          ) {
            continue;
          }

          if (
            response.data.items[j].qualityLevel >=
            response.data.items[i].qualityLevel
          ) {
            break;
          } else {
            pity += 1;
          }
        }
      }

      // calc win
      if (response.data.items[i].qualityLevel >= 5) {
        const conveneTime = dayjs(response.data.items[i].time);
        const matchBanners = banners
          .filter((e) => {
            return e.type === response.data.items[i].cardPoolType && e.time;
          })
          .filter((banner) => {
            const timeStart = dayjs(banner.time!.start);
            const timeEnd = dayjs(banner.time!.end);
            return timeStart < conveneTime && timeEnd > conveneTime;
          });

        if (matchBanners.length) {
          win =
            matchBanners.findIndex((e) => {
              return e.featuredRare === response.data.items[i].name;
            }) >= 0;
        }
        console.debug(response.data.items[i].name, win);
      }

      return {
        _id: randomId(),
        playerId: playerId,
        cardPoolType: e.cardPoolType,
        qualityLevel: e.qualityLevel,
        resourceType: e.resourceType as any,
        name: e.name,
        time: e.time,
        pity,
        win,
        createdAt: new Date(e.time).getTime() - i
      };
    });
    await db.convenes.bulkInsert(conveneWrites);

    // update character list
    const resonators = items.filter((e) => e.resourceType === 'Resonators');
    const characterObjects = (() => {
      const output = {};

      for (const element of resonators) {
        output[element.name] ??= {
          name: element.name,
          resonanceChain: -1,
          obtainedAt: 0
        };
        output[element.name].resonanceChain += 1;
        output[element.name].obtainedAt = (() => {
          return resonators
            .filter((e) => e.name === element.name)
            .sort((a, b) => {
              const timeA = dayjs(a.time);
              const timeB = dayjs(b.time);
              return timeA.toDate().getTime() - timeB.toDate().getTime();
            })[0].time;
        })();
      }

      return output;
    })();
    const characterWrites = Object.keys(characterObjects).flatMap((e) => {
      return characterObjects[e];
    });
    await db.characters.bulkUpsert(characterWrites);

    sidebar.setNotify('/characters', 1, 'resetOnVisit');
    await new Promise((resolve) => setTimeout(resolve, 250)); // ensure :D
    router.push(localePath('/convene-history'));
  } catch (error) {
    // TODO: handle error
    alert(error);
  } finally {
    resetState();
  }
};

const onPressAbortImport = () => resetState();

// computed
const overlay = computed(() => state.value == 'import');

// functions
const resetState = () => {
  state.value = '';
  importState.value = undefined;
};

const loadConveneHistoryUrl = () => {
  account
    .getConveneHistoryUrl()
    .then((result) => {
      conveneHistoryUrl.value = result;
    })
    .catch(console.warn);
};

// changes
watch(
  () => account.active,
  () => loadConveneHistoryUrl()
);

// lifecycle
onMounted(() => {
  if (isIos) {
    method.value = 'ios';
  } else if (isAndroid) {
    method.value = 'android';
  }

  loadConveneHistoryUrl();
});

// seo meta
const title = i18n.t('convene.import.title');
const description = i18n.t('meta.convene.history.description');

useApp().title = i18n.t('convene.import.title');
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
          to: '/convene-history/import',
          title: i18n.t('common.import')
        }
      ]"
    />

    <!-- alert -->
    <alert
      id="convene.import.alert"
      class="mb-2"
      :text="$t('convene.import.alert')"
    />

    <v-card>
      <client-only>
        <v-tabs v-model="method">
          <v-tab value="pc">{{ $t('PC') }}</v-tab>
          <v-tab value="android">{{ $t('Android') }}</v-tab>
          <v-tab value="ios">{{ $t('iOS') }}</v-tab>
        </v-tabs>
        <v-divider />

        <convene-history-import-method-pc
          v-if="method == 'pc'"
          :convene-history-url="conveneHistoryUrl"
          @on-import="onImport"
        />
        <convene-history-import-method-android
          v-if="method == 'android'"
          :convene-history-url="conveneHistoryUrl"
          @on-import="onImport"
        />
        <convene-history-import-method-ios
          v-if="method == 'ios'"
          :convene-history-url="conveneHistoryUrl"
          @on-import="onImport"
        />
      </client-only>
    </v-card>

    <v-sheet class="mt-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="index in 3" :key="index">
          <v-expansion-panel-title>
            {{ $t(`convene.import.faqs.${index}.title`) }}
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            {{ $t(`convene.import.faqs.${index}.content`) }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-sheet>

    <v-overlay
      v-model="overlay"
      :persistent="true"
      class="d-flex align-center justify-center"
    >
      <v-sheet rounded class="pa-4 text-center" :min-width="200">
        <v-progress-circular :indeterminate="true" />

        <div class="mt-4">
          {{ importState || i18n.t('convene.import.processing') }}
        </div>

        <v-btn
          :append-icon="mdiCancel"
          :text="$t('common.cancel')"
          class="mt-4"
          color="error"
          @click="onPressAbortImport"
        />
      </v-sheet>
    </v-overlay>
  </div>
</template>
