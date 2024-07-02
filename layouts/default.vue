<script setup lang="ts">
import {
  mdiGithub,
  mdiLogin,
  mdiLogout,
  mdiTranslate,
  mdiCogs,
  mdiSwapVertical,
  mdiDatabaseSearch
} from '@mdi/js';

import BackupController from '../controllers/backup.vue';
import DatabaseController from '../controllers/database.vue';
import DialogController from '../controllers/dialog.vue';
import NotificationController from '../controllers/notification.vue';
import SnackbarController from '../controllers/snackbar.vue';
import SearchController from '../controllers/search.vue';

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
      <v-list>
        <client-only>
          <v-list-item
            :title="
              auth.user
                ? auth.user.displayName || 'Anonymous'
                : $t('common.guest')
            "
            :subtitle="
              auth.user
                ? auth.user.email || auth.user.uid
                : $t('common.guestSubtitle')
            "
          >
            <template #prepend>
              <v-avatar class="border">
                <v-img
                  v-if="auth.user && auth.user.photoURL"
                  :src="auth.user.photoURL"
                />
                <span v-else>?</span>
              </v-avatar>
            </template>
          </v-list-item>
        </client-only>
      </v-list>
      <v-divider />

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
            :to="localePath('/settings')"
            :title="$t('settings.title')"
            :append-icon="mdiCogs"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar class="border-b">
      <v-app-bar-nav-icon @click="sidebar.open = !sidebar.open" />
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

      <client-only>
        <!-- account -->
        <v-menu v-if="account.items.length > 1" :min-width="200">
          <template #activator="{ props }">
            <v-btn variant="outlined" v-bind="props" class="mr-2">
              <v-icon :icon="mdiSwapVertical" class="hidden-md-and-up" />
              <span class="hidden-sm-and-down">
                {{ $t('Account') }} {{ account.active }}
              </span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(element, index) in account.items"
              :key="index"
              :value="index"
              :active="element.playerId == account.active"
              :disabled="element.playerId == account.active"
              @click="() => (account.active = element.playerId)"
            >
              <v-list-item-title>
                {{ $t('Player Id') }}:
                {{ element.playerId }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </client-only>

      <template #append>
        <div class="d-flex flex-wrap ga-2">
          <v-btn variant="outlined" @click="() => (search.active = true)">
            <v-icon :icon="mdiDatabaseSearch" />
            <span class="hidden-sm-and-down ml-2">
              {{ $t('search.title') }}
            </span>
          </v-btn>

          <!-- auth -->
          <client-only>
            <v-btn
              v-if="auth.isLoggedIn"
              :disabled="state != ''"
              :loading="state == 'sign-out'"
              color="error"
              variant="outlined"
              @click="onPressedSignOut"
            >
              <v-icon :icon="mdiLogout" />
              <span class="hidden-sm-and-down ml-2">
                {{ $t('common.signOut') }}
              </span>
            </v-btn>

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
              <span class="hidden-sm-and-down ml-2">
                {{ $t('common.signIn') }}
              </span>
            </v-btn>
          </client-only>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <v-container :fluid="app.fluid">
        <slot />
      </v-container>

      <v-divider />
      <v-footer class="pa-8 d-block">
        <div>
          <div>
            <v-row :no-gutters="true">
              <v-col cols="12" md="6" class="d-flex align-center">
                <h2>
                  {{ app.name }}
                </h2>
              </v-col>

              <!-- Developers -->
              <v-col cols="12" md="2">
                <div class="font-weight-bold">
                  {{ $t('Developers') }}
                </div>

                <div>
                  <a :href="app.githubRepo" target="_blank" title="Github">
                    Github
                  </a>
                </div>
                <div>
                  <a :href="app.discord" target="_blank" title="Discord">
                    Discord
                  </a>
                </div>
                <div>
                  <a
                    :href="`${app.githubRepo}/issues`"
                    target="_blank"
                    :title="$t('Report a Bug')"
                  >
                    {{ $t('Report a Bug') }}
                  </a>
                </div>
              </v-col>

              <!-- Resources -->
              <v-col cols="12" md="2">
                <div class="font-weight-bold">
                  {{ $t('Resources') }}
                </div>

                <div>
                  <a
                    href="https://wutheringwaves.kurogames.com/"
                    target="_blank"
                  >
                    Wuthering Waves
                  </a>
                </div>

                <div>
                  <a href="https://kurogames.com/" target="_blank">
                    Kuro Games
                  </a>
                </div>
              </v-col>

              <!-- Legal -->
              <v-col cols="12" md="2">
                <div class="font-weight-bold">
                  {{ $t('Legal') }}
                </div>

                <div>
                  <router-link to="/terms-and-conditions">
                    {{ $t('Terms & Conditions') }}
                  </router-link>
                </div>

                <div>
                  <router-link to="/privacy-policy">
                    {{ $t('Privacy Policy') }}
                  </router-link>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-divider class="mt-4 mb-4" />

          <div class="d-flex flex-column">
            <div class="d-flex w-100 align-center">
              <div>
                <div>© {{ new Date().getFullYear() }} {{ app.name }}</div>
                <div>
                  All game assets and trademarks are the property of their
                  respective owners.
                </div>
              </div>

              <v-spacer />

              <v-btn :icon="mdiGithub" size="small" variant="plain" />
              <v-btn :icon="mdiGithub" size="small" variant="plain" />
              <v-btn :icon="mdiGithub" size="small" variant="plain" />
            </div>
          </div>
        </div>
      </v-footer>

      <client-only>
        <BackupController />
        <DialogController />
        <NotificationController />
        <DatabaseController />
        <SnackbarController />
        <SearchController />
      </client-only>
    </v-main>
  </v-app>
</template>
