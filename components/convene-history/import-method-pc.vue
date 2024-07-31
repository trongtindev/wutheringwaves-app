<script setup lang="ts">
import { mdiOpenInNew, mdiImport, mdiContentCopy, mdiCheck } from '@mdi/js';

const props = defineProps<{
  conveneHistoryUrl?: string;
}>();

const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();

// uses
const i18n = useI18n();
const clipboard = useClipboard();

// states
const url = ref<string>();
const step = ref(1);
const isCopied = ref(false);

// events
const next = () => {
  step.value += 1;
};

const prev = () => {
  step.value -= 1;
};

const onPressedCopyScript = () => {
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 3000);
  clipboard.copy(powershellScript.value);
};

const onPressedImport = async () => {
  emits('on-import', url.value!);
};

const onPressedPowerShell = () => {
  if (i18n.locale.value == 'vi') {
    window.open(
      'https://www.google.com/search?q=c%C3%A1ch+m%E1%BB%9F+Windows+PowerShell',
    );
  } else {
    window.open(
      'https://www.google.com/search?q=how+to+run+Windows+PowerShell',
    );
  }
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

const powershellUrl = computed(() => {
  return 'https://raw.githubusercontent.com/trongtindev/wutheringwaves-app/production/get-url.ps1';
});

const powershellScript = computed(() => {
  return `[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; Invoke-Expression (New-Object Net.WebClient).DownloadString("${powershellUrl.value}")`;
});

// changes
watch(
  () => props.conveneHistoryUrl,
  (value) => {
    if (!value) return;
    url.value = value;
  },
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
    <v-stepper-vertical v-model="step">
      <template #default>
        <!-- step1 -->
        <v-stepper-vertical-item
          :complete="step > 1"
          :title="$t('convene.import.guides.pc.default.1.title')"
          :value="1"
        >
          <v-responsive
            class="border rounded"
            :aspect-ratio="18 / 9"
            :max-width="500"
          >
            <v-img src="/screenshots/in-game-convene-history.webp" />
          </v-responsive>

          <template #next>
            <v-btn color="primary" :text="$t('common.next')" @click="next" />
          </template>
          <template #prev></template>
        </v-stepper-vertical-item>

        <!-- step2 -->
        <v-stepper-vertical-item
          :complete="step > 2"
          :title="$t('convene.import.guides.pc.default.2.title')"
          :value="2"
        >
          <i18n-t
            keypath="convene.import.guides.pc.default.2.content"
            tag="p"
            class="mb-4"
          >
            <template #windowsPowerShell>
              <v-chip :append-icon="mdiOpenInNew" @click="onPressedPowerShell">
                Windows PowerShell
              </v-chip>
            </template>
          </i18n-t>

          <v-responsive
            class="border rounded mb-4"
            :aspect-ratio="18 / 9"
            :max-width="500"
          >
            <v-img src="/screenshots/windows-powershell.webp" />
          </v-responsive>

          <v-text-field
            :readonly="true"
            :value="powershellScript"
            :max-width="500"
            onclick="this.select()"
          >
            <template #append-inner>
              <v-btn
                size="small"
                variant="text"
                :icon="isCopied ? mdiCheck : mdiContentCopy"
                @click="onPressedCopyScript"
              />
            </template>
          </v-text-field>

          <div>
            You can review the script
            <a
              ref="nofollow"
              :href="powershellUrl"
              target="_blank"
              class="font-weight-bold"
            >
              here
            </a>
          </div>

          <template #next>
            <v-btn color="primary" :text="$t('common.next')" @click="next" />
          </template>

          <template #prev>
            <v-btn
              variant="plain"
              :text="$t('common.previous')"
              @click="prev"
            />
          </template>
        </v-stepper-vertical-item>

        <!-- step3 -->
        <v-stepper-vertical-item
          :title="$t('convene.import.guides.pc.default.3.title')"
          :value="3"
          @click:next="onPressedImport"
        >
          <v-responsive
            class="border rounded mb-4"
            :aspect-ratio="18 / 9"
            :max-width="500"
          >
            <v-img src="/screenshots/convene-record-url-result.webp" />
          </v-responsive>

          <v-text-field
            v-model="url"
            type="url"
            :hide-details="true"
            :error="urlError.length > 0"
            placeholder="https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html"
          />

          <template #next>
            <v-btn
              color="primary"
              :disabled="!canImport"
              :prepend-icon="mdiImport"
              :text="$t('convene.import.title')"
              @click="onPressedImport"
            />
          </template>

          <template #prev>
            <v-btn
              variant="plain"
              :text="$t('common.previous')"
              @click="prev"
            />
          </template>
        </v-stepper-vertical-item>
      </template>
    </v-stepper-vertical>
  </div>
</template>
