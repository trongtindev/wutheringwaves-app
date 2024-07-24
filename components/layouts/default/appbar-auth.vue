<script lang="ts" setup>
import { mdiLogin } from '@mdi/js';

// uses
const auth = useAuth();

// events
const onPressedSignIn = async () => {
  auth.state = 'sign-in';

  try {
    await auth.signIn();
  } catch (error) {
    console.error(error);

    // TODO: handle this
    alert(error);
  } finally {
    auth.state = '';
  }
};

const onPressedSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('error', error);

    // TODO: handle this
    alert(error);
  }
};
</script>

<template>
  <client-only>
    <template #fallback>
      <v-btn
        :text="$t('common.signIn')"
        :disabled="true"
        color="primary"
        variant="flat"
      >
        <v-icon :icon="mdiLogin" />
        <span class="ml-2">
          {{ $t('common.signIn') }}
        </span>
      </v-btn>
    </template>

    <v-menu v-if="auth.user && auth.isLoggedIn">
      <template #activator="{ props }">
        <v-btn :border="true" :icon="true">
          <v-avatar v-bind="props">
            <v-img v-if="auth.user.photoUrl" :src="auth.user.photoUrl">
              <template #error>
                <div class="d-flex align-center justify-center w-100 h-100">
                  ?
                </div>
              </template>
            </v-img>
            <span v-else>?</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card :min-width="300">
        <v-card-text class="text-center">
          <v-avatar :size="64" class="border pa-1">
            <v-img
              v-if="auth.user.photoUrl"
              :src="auth.user.photoUrl"
              class="rounded-circle border"
            >
              <template #error>
                <div class="d-flex align-center justify-center w-100 h-100">
                  ?
                </div>
              </template>
            </v-img>
            <span v-else>?</span>
          </v-avatar>
        </v-card-text>
        <v-card-title class="text-center">
          {{ auth.user.name }}
        </v-card-title>
        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="warning"
            :text="$t('common.signOut')"
            @click="() => onPressedSignOut()"
          />
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn
      v-else
      color="primary"
      variant="flat"
      :text="$t('common.signIn')"
      :disabled="auth.state != ''"
      :loading="auth.state == 'sign-in'"
      @click="() => onPressedSignIn()"
    >
      <v-icon :icon="mdiLogin" />
      <span class="ml-2">
        {{ $t('common.signIn') }}
      </span>
    </v-btn>
  </client-only>
</template>
