<script setup lang="ts">
import { mdiOpenInNew, mdiImport } from '@mdi/js';

const props = defineProps<{
  conveneHistoryUrl?: string;
}>();

const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();

// uses
const i18n = useI18n();

// states
const url = ref<string>();

// events
const onPressedPowerShell = () => {
  if (i18n.locale.value == 'vi') {
    window.open(
      'https://www.google.com/search?q=c%C3%A1ch+m%E1%BB%9F+Windows+PowerShell'
    );
  } else {
    window.open(
      'https://www.google.com/search?q=how+to+run+Windows+PowerShell'
    );
  }
};

const onPressedImport = async () => {
  emits('on-import', url.value!);
};

// computed
const urlError = computed<string>(() => {
  if (typeof url.value !== 'undefined') {
    if (url.value.startsWith('https') === false) {
      return i18n.t('common.invalidLink');
    }
  }
  return '';
});

const canImport = computed<boolean>(() => {
  return typeof url.value !== 'undefined' && urlError.value.length == 0;
});

// changes
watch(
  () => props.conveneHistoryUrl,
  (value) => {
    if (!value) return;
    url.value = value;
  }
);

// lifecycle
onMounted(() => {
  if (props.conveneHistoryUrl) {
    url.value = props.conveneHistoryUrl;
  }
});
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
          Mở <b>Wuthering Waves</b> trên PC.
        </span>
        <span v-else> Open <b>Wuthering Waves</b> on PC. </span>
      </v-list-item>

      <!-- step2 -->
      <v-list-item>
        <template #prepend>
          <v-avatar text="2" class="bg-grey-darken-3" />
        </template>

        <span v-if="i18n.locale.value == 'vi'">
          Mở trang lịch sử Convene và chờ nó tải xong danh sách.
        </span>
        <span v-else> Open Convene Records and wait for pulls to load. </span>
      </v-list-item>

      <!-- step3 -->
      <v-list-item>
        <template #prepend>
          <v-avatar text="3" class="bg-grey-darken-3" />
        </template>

        <span v-if="i18n.locale.value == 'vi'">
          Mở
          <v-chip :append-icon="mdiOpenInNew" @click="onPressedPowerShell">
            Windows PowerShell
          </v-chip>
          và chạy dòng mã bên dưới (Dán đường dẫn tới thư mục game nếu được
          hỏi).
        </span>
        <span v-else>
          Open
          <v-chip :append-icon="mdiOpenInNew" @click="onPressedPowerShell">
            Windows PowerShell
          </v-chip>
          and run the following command (Paste your game path if asked).
        </span>
      </v-list-item>

      <div class="ml-16 mt-2">
        <v-textarea
          :readonly="true"
          :hide-details="true"
          :rows="2"
          value='[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; Invoke-Expression (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/trongtindev/astrite-app/main/getGacha.ps1")'
        />
        <v-alert color="warning" class="mt-2">
          {{ $t('You can review the script') }}
          <v-chip
            target="_blank"
            href="https://raw.githubusercontent.com/trongtindev/astrite-app/main/getGacha.ps1"
            :append-icon="mdiOpenInNew"
          >
            getGacha.ps1
          </v-chip>
        </v-alert>
      </div>

      <!-- step4 -->
      <v-list-item>
        <template #prepend>
          <v-avatar text="4" class="bg-grey-darken-3" />
        </template>

        <span v-if="i18n.locale.value == 'vi'">
          Dán Gacha Log URL đã sao chép vào ô bên dưới.
        </span>
        <span v-else> Paste the Gacha Log URL into the box below. </span>
      </v-list-item>
      <div class="pl-16">
        <v-text-field
          v-model="url"
          type="url"
          :hide-details="true"
          :error="urlError.length > 0"
          placeholder="https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html"
        />

        <v-alert color="info" class="mt-2">
          <span v-if="i18n.locale.value == 'vi'">
            URL này không có tác dụng như là một token hoặc cookie nên không có
            quyền truy cập vào tài khoản của bạn.
          </span>
          <span v-else>
            This URL does not act as a token or cookie, so it does not have
            access to your account.
          </span>
        </v-alert>
      </div>
    </v-card-text>
    <v-divider />

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
