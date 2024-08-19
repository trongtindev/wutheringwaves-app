<script setup lang="ts">
import { mdiDownload, mdiImport, mdiOpenInNew } from '@mdi/js';

const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();

// uses
const i18n = useI18n();

// states
const json = ref();
const sampleJSON = ref({
  recordId: '1b491c0f6d52f3f00e3b1835fee7a6fc',
  playerId: '901509113',
  serverId: 'f7f187161ce9dea7b8d091b2214db191',
  cardPoolId: 'c646aadfe1ad61b9c50654ff43b2a832',
  cardPoolType: 1,
  languageCode: 'en',
});

// computed
const jsonError = computed<boolean>(() => {
  if (typeof json.value !== 'undefined') {
    if (
      json.value.startsWith('{') === false &&
      json.value.startsWith('}') === false
    ) {
      return true;
    }
  }
  return false;
});

const canImport = computed<boolean>(() => {
  return typeof json.value !== 'undefined' && !jsonError.value;
});

// events
const onPressedDownload = () => {
  window.open(
    'https://apps.apple.com/us/app/stream-network-debug-tool/id1312141691',
  );
};

const onPressedImport = () => {
  // convert json to URL
  const parse = JSON.parse(json.value);
  const uri = new URL(
    'https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html#/record',
  );
  uri.searchParams.set('record_id', parse.recordId);
  uri.searchParams.set('player_id', parse.playerId);
  uri.searchParams.set('svr_id', parse.serverId);
  uri.searchParams.set('resources_id', parse.cardPoolId);
  uri.searchParams.set('lang', parse.languageCode);

  emits('on-import', uri.toString());
};
</script>

<template>
  <div>
    <v-card-text>
      <!-- step1 -->
      <v-list-item>
        <template #prepend>
          <v-avatar text="1" class="bg-grey-darken-3" />
        </template>

        <span v-if="i18n.locale.value == 'vi'">
          Tương tự như việc lấy lịch sử của bạn trong Genshin Impact hoặc Honkai
          Star Rail, hãy làm theo
          <v-chip :prepend-icon="mdiOpenInNew" @click="onPressedDownload">
            video hướng dẫn này của paimon.moe
          </v-chip>
          để tải xuống và sử dụng
          <v-chip :prepend-icon="mdiDownload" @click="onPressedDownload">
            Stream - Network Debug Tool
          </v-chip>
        </span>
        <span v-else>
          Similar to getting your history in Genshin Impact or Honkai Star Rail,
          follow
          <v-chip :prepend-icon="mdiOpenInNew" @click="onPressedDownload">
            this video tutorial by paimon.moe
          </v-chip>
          to download and use
          <v-chip :prepend-icon="mdiDownload" @click="onPressedDownload">
            Stream - Network Debug Tool
          </v-chip>
        </span>
      </v-list-item>
      <div class="ml-16 mt-2">
        <ul class="pl-4">
          <li v-if="i18n.locale.value == 'vi'">
            Trước khi sniffing, hãy đi tới Cài đặt > Cài đặt chung > Giới thiệu
            > sau đó cuộn xuống và nhấn vào "Cài đặt tin cậy chứng chỉ" và BẬT
            "Đã tạo luồng CA".
          </li>
          <li v-else>
            Before sniffing, go to Go Settings > General > About > then scroll
            down and tap "Certificate Trust Settings"and turn ON "Stream
            Generated CA".
          </li>

          <li v-if="i18n.locale.value == 'vi'">
            Tìm POST bắt đầu bằng
            <b>https://gmserver-api.aku-game2.net/gacha/record/query</b> rồi
            nhấp vào <b>"Request" > "Preview JSON"</b> rồi sao chép nó.
          </li>
          <li v-else>
            Find the POST starting with
            <b>https://gmserver-api.aku-game2.net/gacha/record/query</b> and
            then, click on <b>"Request" > "Preview JSON"</b> then copy it.
          </li>
        </ul>
      </div>

      <!-- step2 -->
      <v-list-item>
        <template #prepend>
          <v-avatar text="2" class="bg-grey-darken-3" />
        </template>

        <span v-if="i18n.locale.value == 'vi'"> Dán nội dung JSON vào đây</span>
        <span v-else> Paste the JSON Here </span>
      </v-list-item>
    </v-card-text>
    <div class="pl-16">
      <v-textarea
        v-model="json"
        :hide-details="true"
        :error="jsonError"
        :placeholder="JSON.stringify(sampleJSON)"
      />

      <v-alert color="info" class="mt-2">
        <span v-if="i18n.locale.value == 'vi'">
          JSON này không có tác dụng như là một token hoặc cookie nên không có
          quyền truy cập vào tài khoản của bạn.
        </span>
        <span v-else>
          This JSON does not act as a token or cookie, so it does not have
          access to your account.
        </span>
      </v-alert>
    </div>

    <v-card-actions class="d-flex justify-end">
      <v-btn
        :disabled="!canImport"
        :text="$t('convene.import.title')"
        :append-icon="mdiImport"
        variant="flat"
        @click="onPressedImport"
      />
    </v-card-actions>
  </div>
</template>
