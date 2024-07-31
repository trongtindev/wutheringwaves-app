<script setup lang="ts">
import { mdiCancel } from '@mdi/js';

// uses
const i18n = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const account = useAccount();
const { isIos, isAndroid } = useDevice();
const sidebar = useSidebar();
const importConvene = useImportConvene();
const device = useDevice();

// states
const state = ref<'' | 'import'>('');
const method = ref<'pc' | 'android' | 'ios'>('pc');
const importState = ref();
const conveneHistoryUrl = ref();

// events
const onImport = (url: string) => {
  resetState();
  state.value = 'import';

  importConvene
    .start(url)
    .then((result) => {
      if (account.active != result.playerId) {
        account.active = result.playerId;
      }

      sidebar.setNotify('/characters', 1, 'resetOnVisit');
      router.push(localePath('/convene-history'));
    })
    .catch((error) => {
      console.error(error);
      alert(error);
    })
    .finally(() => {
      resetState();
    });
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
  () => loadConveneHistoryUrl(),
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

useAppBar().title = i18n.t('convene.import.title');
useHead({
  title,
  meta: [
    {
      name: 'robots',
      content: 'noindex',
    },
  ],
});
useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
});

// block crawler
if (device.isCrawler) throw createError({ statusCode: 404 });
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
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
    </v-col>

    <v-col cols="12" md="4">
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
    </v-col>

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
  </v-row>
</template>
