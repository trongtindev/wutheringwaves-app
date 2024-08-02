<script setup lang="ts">
import {
  mdiContentCopy,
  mdiCheck,
  mdiContentPaste,
  mdiReload,
  mdiLinkVariantOff,
  mdiLinkVariantPlus,
  mdiOpenInNew,
} from '@mdi/js';

// uses
const api = useApi();
const auth = useAuth();
const role = useRole();
const clipboard = useClipboard();
const { DISCORD_INVITE_LINK, DISCORD_BOT_NAME } = useRuntimeConfig().public;

// states
const copied = ref();
const pasted = ref();
const status = ref<'' | 'link' | 'unlink' | 'refresh'>('');
const verifyCode = ref();

// computed
const linkMessage = computed(() => {
  if (auth.user) {
    return `/link ${auth.user.id}`;
  }
  return '';
});

// events
const onPressedCopy = () => {
  clipboard.copy(linkMessage.value);
  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2500);
};

const onPressPaste = () => {
  navigator.clipboard.readText().then((result) => {
    verifyCode.value = result;
  });
  pasted.value = true;

  setTimeout(() => {
    pasted.value = false;
  }, 2500);
};

const onPressedDiscord = () => window.open(DISCORD_INVITE_LINK);

const onPressedLink = () => {
  status.value = 'link';
  api
    .post(
      '/users/me/link',
      {
        code: verifyCode.value,
      },
      {
        handleError: true,
      },
    )
    .then(async () => {
      await role.refreshRoles();
    })
    .finally(() => {
      status.value = '';
    });
};

const onPressedUnlink = () => {
  status.value = 'unlink';
  api
    .delete('/users/me/link', {
      handleError: true,
    })
    .then(() => {
      role.roles = null;
    })
    .finally(() => {
      status.value = '';
    });
};

const onPressedRefreshRoles = () => {
  status.value = 'refresh';
  role.refreshRoles(true).finally(() => {
    status.value = '';
  });
};
</script>

<template>
  <div>
    <!-- verified -->
    <v-card v-if="role.verified" :title="$t('settings.roles.title')">
      <v-card-text>
        <base-alert :text="$t('settings.roles.message')" class="mb-2" />

        <!-- empty roles -->
        <base-alert
          v-if="role.roles?.length == 0"
          :text="$t('settings.roles.emptyRoles')"
          color="warning"
          class="mb-2"
        />

        <!-- list roles -->
        <div v-else class="d-flex align-center justify-center flex-wrap ga-2">
          <v-chip
            v-for="(item, index) in role.roles"
            :key="index"
            :text="item"
            color="info"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="warning"
          :text="$t('settings.roles.unlink')"
          :disabled="status != ''"
          :loading="status === 'unlink'"
          :prepend-icon="mdiLinkVariantOff"
          @click="() => onPressedUnlink()"
        />
        <v-spacer />
        <v-btn
          :text="$t('settings.roles.refreshRoles')"
          :disabled="status != ''"
          :loading="status === 'refresh'"
          :prepend-icon="mdiReload"
          variant="tonal"
          @click="() => onPressedRefreshRoles()"
        />
      </v-card-actions>

      <sign-in-required v-if="!auth.isSignedIn" />
    </v-card>

    <!-- verify -->
    <v-card v-else :title="$t('settings.roles.title')">
      <v-card-text>
        <base-alert
          :text="
            $t('settings.roles.setupGuide1', {
              name: DISCORD_BOT_NAME,
            })
          "
          class="mb-2"
        />
        <v-text-field
          v-model="linkMessage"
          :hide-details="true"
          :readonly="true"
          class="mb-2"
          onclick="this.select()"
        >
          <template #append-inner>
            <v-btn
              variant="text"
              :icon="copied ? mdiCheck : mdiContentCopy"
              :disabled="!clipboard.isSupported.value"
              @mousedown.stop
              @mouseup.stop
              @click="() => onPressedCopy()"
            />
          </template>
        </v-text-field>

        <base-alert :text="$t('settings.roles.setupGuide2')" class="mb-2" />
        <v-text-field
          v-model="verifyCode"
          :label="$t('settings.roles.verifyCode')"
          placeholder="ey..."
          :hide-details="true"
        >
          <template #append-inner>
            <v-btn
              variant="text"
              :icon="pasted ? mdiCheck : mdiContentPaste"
              :disabled="!clipboard.isSupported.value"
              @click="() => onPressPaste()"
            />
          </template>
        </v-text-field>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-btn
          :text="$t('common.joinTheDiscord')"
          :prepend-icon="mdiOpenInNew"
          @click="() => onPressedDiscord()"
        />
        <v-spacer />
        <v-btn
          variant="flat"
          :text="$t('settings.roles.link')"
          :disabled="status != '' || !verifyCode"
          :loading="status === 'link'"
          :prepend-icon="mdiLinkVariantPlus"
          @click="() => onPressedLink()"
        />
      </v-card-actions>

      <sign-in-required v-if="!auth.isSignedIn" />
    </v-card>
  </div>
</template>
