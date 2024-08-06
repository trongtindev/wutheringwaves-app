<script setup lang="ts">
import { mdiChevronRight, mdiDownload, mdiGithub, mdiOpenInNew } from '@mdi/js';

// define
const { SITE_NAME, SITE_REPO, DISCORD_INVITE_LINK } = useRuntimeConfig().public;

// uses
const i18n = useI18n();
const resources = useResources();
const localePath = useLocalePath();

// fetch
const weapons = await resources.getWeapons();
const upcomingWeapons = weapons.filter((e) => e.upcoming);
const upcomingCharacters = await resources.getCharacters({
  hidden: false,
  upcoming: true,
});

// seo meta
const title = i18n.t('meta.index.title');

useAppBar().title = i18n.t('common.home');
useHead({ title });
useSeoMeta({
  title: title,
  description: i18n.t('meta.description'),
});
</script>

<template>
  <div>
    <!-- grids -->
    <masonry>
      <template #default="masonry">
        <v-card class="pa-4">
          <div class="d-flex flex-wrap ga-2 justify-center">
            <v-chip
              :prepend-icon="mdiGithub"
              :text="$t('common.viewOnGithub')"
              :href="SITE_REPO"
              target="_blank"
            />

            <v-chip
              :prepend-icon="mdiOpenInNew"
              :text="$t('common.joinTheDiscord')"
              :href="DISCORD_INVITE_LINK"
              target="_blank"
            />
          </div>

          <div class="text-center mt-4">
            <div>
              <h1 class="text-h4">WutheringWaves.app</h1>
            </div>
            <div class="mt-1">
              <h2 class="text-h5">{{ i18n.t('meta.index.title') }}</h2>
            </div>
            <div class="mt-2">
              <h3 class="text-h6">{{ i18n.t('meta.description') }}</h3>
            </div>
          </div>
        </v-card>

        <!-- desktop app -->
        <v-card>
          <v-card-title>
            {{ $t('desktopApp.title') }}
          </v-card-title>

          <v-card-text>
            <!-- <v-responsive :aspect-ratio="2 / 1" class="border rounded mb-2" /> -->
            {{ $t('desktopApp.introduce') }}
          </v-card-text>

          <v-card-actions class="d-flex justify-end">
            <v-card-btn
              :disabled="true"
              :text="$t('common.upcoming')"
              :append-icon="mdiDownload"
            />
          </v-card-actions>
        </v-card>

        <!-- latest posts -->
        <guides-editor-latest-posts />

        <!-- current event -->
        <timeline-summary-widget @on-done="masonry.refreshLayout" />

        <!-- yourLastConvene -->
        <v-card>
          <v-card-title>
            {{ $t('common.yourLastConvene') }}
          </v-card-title>

          <convene-history-recently-widget @on-done="masonry.refreshLayout" />

          <v-card-actions class="d-flex justify-end">
            <v-card-btn
              tag="h2"
              :to="localePath('/convene-history')"
              :append-icon="mdiChevronRight"
            >
              <h2 class="text-body-2">{{ $t('convene.history.title') }}</h2>
            </v-card-btn>
          </v-card-actions>
        </v-card>

        <!-- global convene -->
        <v-card>
          <v-card-title>
            {{ $t('convene.global.title') }}
          </v-card-title>

          <convene-history-global-widget @on-done="masonry.refreshLayout" />

          <v-card-actions class="d-flex justify-end">
            <v-card-btn
              :to="localePath('/convene-history/global')"
              :text="$t('convene.global.title')"
              :append-icon="mdiChevronRight"
            />
          </v-card-actions>
        </v-card>

        <!-- upcomingWeapons -->
        <v-card v-if="upcomingWeapons.length > 0">
          <v-card-title tag="h3">
            {{ $t('common.upcomingWeapons') }}
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                v-for="(item, index) in upcomingWeapons"
                :key="index"
                cols="6"
              >
                <weapon-card :item="item" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- upcomingCharacters -->
        <v-card v-if="upcomingCharacters.length > 0">
          <v-card-title tag="h3">
            {{ $t('common.upcomingCharacters') }}
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                v-for="(item, index) in upcomingCharacters"
                :key="index"
                cols="6"
              >
                <character-card :item="item" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </masonry>

    <v-footer class="pa-4 d-block mt-2">
      <v-row :no-gutters="true">
        <v-col cols="12" md="6" class="d-flex align-center">
          <h2>
            {{ SITE_NAME }}
          </h2>
        </v-col>

        <!-- Developers -->
        <v-col cols="12" md="2">
          <div class="font-weight-bold">
            {{ $t('Developers') }}
          </div>

          <div>
            <a :href="SITE_REPO" target="_blank" title="Github"> Github </a>
          </div>
          <div>
            <a :href="DISCORD_INVITE_LINK" target="_blank" title="Discord">
              Discord
            </a>
          </div>
          <div>
            <a
              :href="`${SITE_REPO}/issues`"
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
            <a href="https://wutheringwaves.kurogames.com/" target="_blank">
              Wuthering Waves
            </a>
          </div>

          <div>
            <a href="https://kurogames.com/" target="_blank"> Kuro Games </a>
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
      <v-divider class="mt-4 mb-4" />

      <div class="d-flex flex-column">
        <div class="d-flex w-100 align-center">
          <div>
            <div>© 2024 {{ SITE_NAME }}</div>
            <div>
              All game assets and trademarks are the property of their
              respective owners.
            </div>
          </div>
        </div>
      </div>
    </v-footer>
  </div>
</template>
