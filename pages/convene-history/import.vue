<script setup lang="ts">
import { mdiCancel } from '@mdi/js';

interface IConvene {
  key: string;
  cardPoolType: number;
  name: string;
  qualityLevel: number;
  resourceId: number;
  resourceType: string;
  time: string;
}

// uses
const api = useApi();
const i18n = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const account = useAccount();
const database = useDatabase();
const platform = usePlatform();

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

    const total = 7;
    const items: IConvene[] = [];

    for (let i = 1; i <= total; i += 1) {
      importState.value = `${i18n.t('convene.import.processing')} ${i}/${total}`;

      const response = await api.getInstance().post<{
        items: IConvene[];
      }>('/convenes/import', {
        url,
        userAgent: navigator.userAgent,
        cardPoolType: i
      });
      response.data.items.forEach((e) => items.push(e));
    }

    const uri = new URL(url.replaceAll('index.html#', 'index.html'));
    const playerId = uri.searchParams.get('player_id');

    // initial account
    await account.upsert(playerId!);
    if (account.active != playerId) {
      account.active = playerId!;
    }

    // save convene history url
    await account.setConveneHistoryUrl(url);

    //  bulk writes history
    const writes = items.map((e) => {
      return {
        key: e.key,
        playerId: playerId!,
        cardPoolType: e.cardPoolType,
        resourceId: e.resourceId,
        resourceType: e.resourceType,
        qualityLevel: e.qualityLevel,
        name: e.name,
        time: e.time,
        createdAt: new Date(e.time).getTime()
      };
    });
    await database.getInstance().convenes.bulkUpsert(writes);

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
  if (platform.isiOS) {
    method.value = 'ios';
  } else if (platform.isAndroid) {
    method.value = 'android';
  }

  loadConveneHistoryUrl();
});

// seo meta
const title = i18n.t('convene.import.title');
const description = i18n.t('meta.convene.history.description');

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

    <v-alert type="info" class="mb-4" :text="$t('convene.import.info')" />

    <v-card>
      <v-card-title>
        <v-row>
          <v-col class="d-flex align-center">
            {{ $t('convene.import.title') }}
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <back-button class="ml-2" to="/convene-history" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />

      <v-tabs v-model="method">
        <v-tab value="pc">{{ $t('PC') }}</v-tab>
        <v-tab value="android">{{ $t('Android') }}</v-tab>
        <v-tab value="ios">{{ $t('iOS') }}</v-tab>
      </v-tabs>

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
    </v-card>

    <v-sheet class="mt-4">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title class="font-weight-bold">
            <span v-if="i18n.locale.value === 'vi'">
              Tại sao dữ liệu không được cập nhật?
            </span>
            <span v-else> Why not updating the record? </span>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <span v-if="i18n.locale.value === 'vi'">
              Có độ trễ 30 phút để cập nhật hồ sơ. Nếu không có dữ liệu nào được
              hiển thị trên trang này, vui lòng thử lại sau. Triệu tập múi giờ
              hiển thị: Mỹ(UTC-5); Châu Âu(UTC+1); Châu Á,HMT, BIỂN(UTC+8).
            </span>
            <span v-else>
              There is a 30-minute delay for record updates. If no data is shown
              on this page, please try again later. Convene displayed time
              zone:America(UTC-5); Europe(UTC+1); Asia,HMT, SEA(UTC+8).
            </span>
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
