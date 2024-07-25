<script setup lang="ts">
import {
  mdiCogs,
  mdiDatabaseSearch,
  mdiMenuClose,
  mdiMenuOpen,
  mdiThemeLightDark
} from '@mdi/js';
import { useTheme } from 'vuetify';

// uses
const app = useApp();
const sidebar = useSidebar();
const localePath = useLocalePath();
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

      <template #append>
        <v-divider />
        <v-list :nav="true" :lines="false">
          <!-- language -->
          <layouts-language-switcher />

          <!-- settings -->
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

      <client-only>
        <manager-backup />
        <manager-dialog />
        <manager-notification />
        <manager-database />
        <manager-snackbar />
        <manager-search />
        <manager-updater />
      </client-only>
    </v-main>
  </v-app>
</template>
