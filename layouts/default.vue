<script setup lang="ts">
import {
  mdiCogs,
  mdiDatabaseSearch,
  mdiMenuClose,
  mdiMenuOpen,
  mdiThemeLightDark
} from '@mdi/js';
import { useTheme } from 'vuetify';

import BackupController from '../controllers/backup.vue';
import DatabaseController from '../controllers/database.vue';
import DialogController from '../controllers/dialog.vue';
import NotificationController from '../controllers/notification.vue';
import SnackbarController from '../controllers/snackbar.vue';
import SearchController from '../controllers/search.vue';

// uses
const app = useApp();
const i18n = useI18n();
const sidebar = useSidebar();
const { locales } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const search = useSearch();
const theme = useTheme();
const analytics = useAnalytics();

// events
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
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar.open">
      <!-- logo -->
      <v-sheet class="pb-2 pt-2">
        <v-list-item title="wutheringwaves.app" subtitle="wutheringwaves.app">
          <template #prepend>
            <v-avatar
              class="border"
              rounded
              image="/favicon.webp"
              alt="WutheringWaves.app"
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
                :title="$t('common.language')"
                v-bind="props"
              >
                <template #append>
                  <v-avatar
                    class="border"
                    :size="24"
                    :image="`/locales/${i18n.locale.value}.webp`"
                    :cover="true"
                  />
                </template>
              </v-list-item>
            </template>

            <v-sheet class="border rounded">
              <v-list density="compact">
                <v-list-item
                  v-for="(element, index) in locales"
                  :key="index"
                  :value="index"
                  :disabled="i18n.locale.value === element.code"
                  :to="switchLocalePath(element.code)"
                >
                  <v-list-item-title>{{ element.name }}</v-list-item-title>

                  <template #append>
                    <v-avatar
                      class="border"
                      :size="24"
                      :image="`/locales/${element.code}.webp`"
                      :cover="true"
                    />
                  </template>
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
    <v-app-bar class="border-b pl-1" :elevation="0">
      <v-app-bar-nav-icon
        :icon="sidebar.open ? mdiMenuOpen : mdiMenuClose"
        @click="sidebar.open = !sidebar.open"
      />

      <!-- app bar title -->
      <v-app-bar-title>
        <client-only>
          <template #fallback>
            {{ $t('common.loading') }}
          </template>

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
            <!-- switch game account -->
            <layouts-default-appbar-account />

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
          <layouts-default-appbar-auth />
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
      </client-only>
    </v-main>
  </v-app>
</template>
