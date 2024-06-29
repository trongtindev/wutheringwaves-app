<script setup lang="ts">
import {
  mdiGithub,
  mdiLogin,
  mdiLogout,
  mdiTranslate,
  mdiCogs,
  mdiSwapVertical
  // mdiPin,
  // mdiPinOff
} from '@mdi/js';

import BackupController from '../controllers/backup.vue';
import DatabaseController from '../controllers/database.vue';
import DialogController from '../controllers/dialog.vue';
import NotificationController from '../controllers/notification.vue';
import SnackbarController from '../controllers/snackbar.vue';

// uses
const app = useApp();
const route = useRoute();
const auth = useAuth();
const sidebar = useSidebar();
const { locales } = useI18n();
const account = useAccount();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

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
      <client-only>
        <v-list>
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
        </v-list>

        <!-- <v-avatar class="mb-4 bg-grey-darken-3" size="64">
            <v-img
              v-if="auth.user && auth.user.photoURL"
              :src="auth.user.photoURL"
            />
          </v-avatar>

          <div v-if="auth.user">
            {{ auth.user.email || auth.user.displayName || auth.user.uid }}
          </div>
          <div v-else>{{ $t('Guest') }}</div> -->
      </client-only>
      <v-divider />

      <v-list :nav="true" :lines="false">
        <v-list-item
          v-for="(element, index) in sidebar.items"
          :key="index"
          :to="localePath(element.url)"
          :title="$t(element.title)"
          :exact="index === 0"
          :active="
            index > 0
              ? route.path.startsWith(localePath(element.url))
              : undefined
          "
          class="rounded"
          @click="() => sidebar.onOpened(element.url)"
        >
          <template #prepend>
            <v-sheet
              class="mr-4 d-flex align-center justify-center"
              :width="32"
              :height="32"
            >
              <v-img
                v-if="element.icon && element.icon.startsWith('/')"
                :src="element.icon"
                :alt="$t(element.title)"
                :width="28"
                :height="28"
              />
              <v-icon v-else :icon="element.icon" :width="28" :height="28" />
            </v-sheet>
          </template>

          <!-- <template #append>
            <v-btn
              @click.prevent="() => sidebar.togglePin(element.url)"
              variant="text"
              size="small"
            >
              <v-icon size="x-small" :icon="mdiPin" />
            </v-btn>
          </template> -->
        </v-list-item>
      </v-list>

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
            <v-list>
              <v-list-item
                v-for="(element, index) in locales"
                :key="index"
                :value="index"
                :to="switchLocalePath(element.code)"
              >
                <v-list-item-title>{{ element.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
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
        <span class="mr-2">{{ app.name }}</span>

        <client-only>
          <v-chip v-if="app.inDev" color="warning" class="hidden-sm-and-down">
            {{ $t('Development') }}
          </v-chip>
          <v-chip v-if="app.indBeta" color="info" class="hidden-sm-and-down">
            {{ $t('Beta') }}
          </v-chip>
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

      <!-- auth -->
      <template #append>
        <client-only>
          <div class="mr-2">
            <v-btn
              v-if="auth.isLoggedIn"
              :append-icon="mdiLogout"
              :text="$t('common.signOut')"
              :disabled="state != ''"
              :loading="state == 'sign-out'"
              color="error"
              variant="outlined"
              @click="onPressedSignOut"
            />

            <v-btn
              v-else
              :append-icon="mdiLogin"
              :text="$t('common.signIn')"
              :disabled="state != ''"
              :loading="state == 'sign-in'"
              color="primary"
              variant="flat"
              @click="() => onPressedSignIn()"
            />
          </div>
        </client-only>
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
      </client-only>
    </v-main>
  </v-app>
</template>
