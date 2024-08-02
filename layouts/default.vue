<script setup lang="ts">
import {
  mdiCogs,
  mdiMagnify,
  mdiMenuClose,
  mdiMenuOpen,
  mdiThemeLightDark,
} from '@mdi/js';
import { useDisplay, useTheme } from 'vuetify';

// define
const { APP_NAME } = useRuntimeConfig().public;

// uses
const appBar = useAppBar();
const sidebar = useSidebar();
const localePath = useLocalePath();
const search = useSearch();
const theme = useTheme();
const analytics = useAnalytics();
const route = useRoute();
const display = useDisplay();

// events
const onPressedToggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === 'dark' ? 'light' : 'dark';
  analytics.logEvent('feature.theme', {
    name: theme.global.name.value,
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
      <!-- sidebar -->
      <v-list :nav="true" :lines="false">
        <!-- logo -->
        <v-list-item :to="localePath('/')" :active="false">
          <template #prepend>
            <v-avatar
              rounded
              image="/icon-192-maskable.png"
              alt="WutheringWaves.app logo"
            />
          </template>

          <v-list-item-title>
            {{ APP_NAME }}
          </v-list-item-title>
          <v-list-item-subtitle> www.wutheringwaves.app </v-list-item-subtitle>
        </v-list-item>

        <nav-item
          v-for="(element, index) in sidebar.items"
          :key="index"
          :data="element"
          :index="index"
        />
      </v-list>

      <template #append>
        <v-divider v-if="display.smAndDown.value" />
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

          <v-sheet v-if="appBar.title" class="text-h6">
            {{ appBar.title }}
          </v-sheet>
        </client-only>
      </v-app-bar-title>

      <!-- app bar actions -->
      <template #append>
        <div class="d-flex align-center mr-2">
          <div class="d-flex flex-wrap ga-2">
            <!-- switch game account -->
            <layouts-default-appbar-account />

            <!-- search -->
            <v-tooltip :text="$t('search.tooltip')" location="bottom">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiMagnify"
                  @click="onPressedSearch"
                />
              </template>
            </v-tooltip>

            <!-- theme -->
            <v-btn
              :icon="mdiThemeLightDark"
              class="hidden-sm-and-down"
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
      <v-container :fluid="true">
        <router-link :to="localePath('/convene-history')">
          <base-alert
            v-if="!route.path.includes('convene')"
            id="convene.message"
            color="warning"
            class="mb-2"
            :text="$t('convene.message')"
            :closable="true"
          />
        </router-link>
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
