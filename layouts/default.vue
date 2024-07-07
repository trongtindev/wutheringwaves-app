<script setup lang="ts">
import {
  mdiGithub,
  mdiLogin,
  mdiLogout,
  mdiTranslate,
  mdiCogs,
  mdiSwapVertical,
  mdiDatabaseSearch,
  mdiMenuClose,
  mdiMenuOpen,
  mdiMenuDown,
  mdiThemeLightDark,
  mdiAccountSwitch,
  mdiChevronRight,
  mdiAccountConvert
} from '@mdi/js';
import { useTheme } from 'vuetify';

import BackupController from '../controllers/backup.vue';
import DatabaseController from '../controllers/database.vue';
import DialogController from '../controllers/dialog.vue';
import NotificationController from '../controllers/notification.vue';
import SnackbarController from '../controllers/snackbar.vue';
import SearchController from '../controllers/search.vue';
import ElectronController from '../controllers/electron.vue';

// uses
const app = useApp();
const i18n = useI18n();
const auth = useAuth();
const sidebar = useSidebar();
const { locales } = useI18n();
const account = useAccount();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const search = useSearch();
const theme = useTheme();
const analytics = useAnalytics();

// states
const state = ref<'' | 'sign-in' | 'sign-out'>('');

// events
const onPressedSignIn = async (options?: { signInWithRedirect?: boolean }) => {
  state.value = 'sign-in';

  try {
    options ??= {};
    await auth.signIn({
      signInWithRedirect: options.signInWithRedirect
    });
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      return onPressedSignIn({ signInWithRedirect: true });
    }

    // TODO: handle this
    console.error(error);
    alert(error);
  } finally {
    state.value = '';
  }
};

const onPressedSignOut = async () => {
  state.value = 'sign-out';
  try {
    const result = await auth.signOut();
    console.log('result', result);
  } catch (error) {
    // TODO: handle this
    console.warn('error', error);
    alert(error);
  } finally {
    state.value = '';
  }
};

const onPressedToggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === 'dark' ? 'light' : 'dark';
  analytics.logEvent('feature.theme', {
    name: theme.global.name.value
  });
};

const onPressedSearch = () => {
  search.active = true;
  analytics.logEvent('feature.search', {});
};

// changes
watch(
  () => auth.state,
  (value) => {
    if (state.value !== 'sign-in' && value == 'sign-in') {
      state.value = 'sign-in';
    } else if (state.value === 'sign-in' && value === '') {
      state.value = '';
    }
  }
);
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar.open">
      <!-- logo -->
      <v-sheet class="pb-2 pt-2">
        <v-list-item title="Astrite.app" subtitle="https://astrite.app">
          <template #prepend>
            <v-avatar
              class="border"
              rounded
              image="/favicon.png"
              alt="Astrite.app"
            />
          </template>
        </v-list-item>
      </v-sheet>
      <v-divider />

      <!-- sidebar -->
      <v-list :nav="true" :lines="false">
        <nav-item
          v-for="(element, index) in sidebar.items"
          :key="index"
          :data="element"
          :index="index"
        />
      </v-list>

      <!-- language -->
      <template #append>
        <v-divider />
        <v-list :nav="true" :lines="false">
          <v-menu>
            <template #activator="{ props }">
              <v-list-item
                rounded
                :append-icon="mdiTranslate"
                :title="$t('common.language')"
                v-bind="props"
              />
            </template>

            <v-sheet class="border rounded">
              <v-list>
                <v-list-item
                  v-for="(element, index) in locales"
                  :key="index"
                  :value="index"
                  :disabled="i18n.locale.value === element.code"
                  :to="switchLocalePath(element.code)"
                >
                  <v-list-item-title>{{ element.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-menu>

          <v-list-item
            rounded
            :to="localePath('/settings')"
            :title="$t('settings.title')"
            :append-icon="mdiCogs"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- app bar -->
    <v-app-bar class="border-b pl-1 pr-1" :elevation="0">
      <v-app-bar-nav-icon
        :icon="sidebar.open ? mdiMenuOpen : mdiMenuClose"
        @click="sidebar.open = !sidebar.open"
      />

      <!-- app bar title -->
      <v-app-bar-title>
        <client-only>
          <span v-if="app.title">
            {{ app.title }}
          </span>
          <span v-else>
            {{ app.name }}
          </span>
        </client-only>
      </v-app-bar-title>

      <!-- app bar actions -->
      <template #append>
        <div class="d-flex align-center mr-2">
          <div class="d-flex flex-wrap ga-2">
            <client-only>
              <!-- switch game account -->
              <v-menu v-if="account.items.length > 1">
                <template #activator="{ props }">
                  <v-btn v-bind="props" :icon="mdiAccountConvert" />
                </template>

                <v-card :min-width="300">
                  <v-card-title>
                    {{ $t('accounts.title') }}
                  </v-card-title>
                  <v-divider />

                  <v-list>
                    <v-list-item
                      v-for="(element, index) in account.items"
                      :key="index"
                      :value="index"
                      :active="element.playerId == account.active"
                      :disabled="element.playerId == account.active"
                      :title="element.name || $t('accounts.nameNotSet')"
                      :subtitle="element.playerId"
                      @click="() => (account.active = element.playerId)"
                    />
                  </v-list>
                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      :to="localePath('/settings#account')"
                      :text="$t('common.manage')"
                    />
                  </v-card-actions>
                </v-card>
              </v-menu>
            </client-only>

            <!-- search -->
            <v-btn
              class="hidden-sm-and-down"
              :icon="mdiDatabaseSearch"
              @click="onPressedSearch"
            />

            <!-- theme -->
            <v-btn
              :icon="mdiThemeLightDark"
              @click="() => onPressedToggleTheme()"
            />
          </div>

          <!-- account -->
          <v-divider :vertical="true" class="mr-4 ml-2" />
          <client-only>
            <v-menu v-if="auth.isLoggedIn">
              <template #activator="{ props }">
                <v-btn :border="true" :icon="true">
                  <v-avatar v-bind="props">
                    <v-img
                      v-if="auth.user.photoURL"
                      :src="auth.user.photoURL"
                    />
                    <span v-else>?</span>
                  </v-avatar>
                </v-btn>
              </template>

              <v-card :min-width="300">
                <v-card-text class="text-center">
                  <v-avatar :size="64" class="border">
                    <v-img
                      v-if="auth.user.photoURL"
                      :src="auth.user.photoURL"
                    />
                    <span v-else>?</span>
                  </v-avatar>
                </v-card-text>
                <v-card-title class="text-center">
                  {{ auth.user.displayName || 'Anonymous' }}
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
              :text="$t('common.signIn')"
              :disabled="state != ''"
              :loading="state == 'sign-in'"
              color="primary"
              variant="flat"
              @click="() => onPressedSignIn()"
            >
              <v-icon :icon="mdiLogin" />
              <span class="ml-2">
                {{ $t('common.signIn') }}
              </span>
            </v-btn>
          </client-only>
        </div>
      </template>
    </v-app-bar>

    <!-- main -->
    <v-main>
      <!-- container -->
      <v-container :fluid="app.fluid">
        <slot />
      </v-container>

      <!-- TODO: remove soon -->
      <client-only>
        <BackupController />
        <DialogController />
        <NotificationController />
        <DatabaseController />
        <SnackbarController />
        <SearchController />
        <ElectronController />
      </client-only>
    </v-main>
  </v-app>
</template>
