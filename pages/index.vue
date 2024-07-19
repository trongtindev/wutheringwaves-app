<script setup lang="ts">
import { mdiGithub, mdiChevronRight, mdiOpenInNew, mdiDownload } from '@mdi/js';

// uses
const app = useApp();
const i18n = useI18n();
const localePath = useLocalePath();

// states
const faqs = ref<number[]>([0, 1, 2, 3, 4]);

// seo meta
const title = i18n.t('meta.index.title');

useApp().title = i18n.t('common.home');
useHead({ title });
useSeoMeta({
  title: title,
  description: i18n.t('meta.description')
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
              :href="app.githubRepo"
              target="_blank"
            />

            <v-chip
              :prepend-icon="mdiOpenInNew"
              :text="$t('common.joinTheDiscord')"
              :href="app.discord"
              target="_blank"
            />
          </div>

          <div class="text-center mt-4">
            <div>
              <h1 class="text-h4">WutheringWaves.app</h1>
            </div>
            <div class="mt-1">
              <h2 class="text-h5">{{ i18n.t('meta.title') }}</h2>
            </div>
            <div class="mt-2">
              <h3 class="text-h6">{{ i18n.t('meta.description') }}</h3>
            </div>
          </div>
        </v-card>

        <!-- desktop app -->
        <v-card>
          <v-card-title>
            {{ $t('electron.desktopApp.title') }}
          </v-card-title>
          <v-divider />

          <v-card-text>
            <!-- <v-responsive :aspect-ratio="2 / 1" class="border rounded mb-2" /> -->
            {{ $t('electron.desktopApp.introduce') }}
          </v-card-text>
          <v-divider />

          <v-card-actions class="d-flex justify-end">
            <v-btn
              variant="text"
              :disabled="true"
              :text="$t('common.upcoming')"
              :append-icon="mdiDownload"
            />
          </v-card-actions>
        </v-card>

        <!-- current event -->
        <v-card @on-done="masonry.refreshLayout">
          <v-card-title>
            {{ $t('timeline.summary') }}
          </v-card-title>
          <v-divider />

          <timeline-summary-widget />
          <v-divider />

          <v-card-actions class="d-flex justify-end">
            <v-btn
              variant="text"
              :to="localePath('/timeline')"
              :text="$t('timeline.title')"
              :append-icon="mdiChevronRight"
            />
          </v-card-actions>
        </v-card>

        <!-- yourLastConvene -->
        <v-card @on-done="masonry.refreshLayout">
          <v-card-title>
            {{ $t('common.yourLastConvene') }}
          </v-card-title>
          <v-divider />

          <convene-history-recently-widget />
          <v-divider />

          <v-card-actions class="d-flex justify-end">
            <v-btn
              :to="localePath('/convene-history')"
              variant="text"
              :text="$t('convene.history.title')"
              :append-icon="mdiChevronRight"
            />
          </v-card-actions>
        </v-card>

        <!-- global convene -->
        <v-card>
          <v-card-title>
            {{ $t('convene.global.title') }}
          </v-card-title>
          <v-divider />

          <convene-history-global-widget @on-done="masonry.refreshLayout" />
          <v-divider />

          <v-card-actions class="d-flex justify-end">
            <v-btn
              variant="text"
              :to="localePath('/convene-history/global')"
              :text="$t('convene.global.title')"
              :append-icon="mdiChevronRight"
            />
          </v-card-actions>
        </v-card>
      </template>
    </masonry>

    <!-- shortcuts -->
    <v-card class="mt-2">
      <v-card-title>
        {{ $t('common.shortcuts') }}
      </v-card-title>
      <v-divider />

      <v-list>
        <v-row :no-gutters="true">
          <v-col cols="12" md="6">
            <v-list-item
              :to="localePath('/showcase/convene')"
              :title="$t('showcase.convene.title')"
              :append-icon="mdiChevronRight"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item
              :to="localePath('/todo-list')"
              :title="$t('todoList.title')"
              :append-icon="mdiChevronRight"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item
              :to="localePath('/echos')"
              :title="$t('echos.title')"
              :append-icon="mdiChevronRight"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item
              :to="localePath('/weapons')"
              :title="$t('weapons.title')"
              :append-icon="mdiChevronRight"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item
              :to="localePath('/characters')"
              :title="$t('characters.title')"
              :append-icon="mdiChevronRight"
            />
          </v-col>
        </v-row>
      </v-list>
    </v-card>

    <!-- faqs -->
    <div class="mt-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="index in faqs" :key="index">
          <v-expansion-panel-title>
            {{ $t(`faqs.${index}.title`) }}
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div
              :innerHTML="
                $t(`faqs.${index}.content`, {
                  repo: app.githubRepo,
                  donationPage: localePath('/donation')
                }).replaceAll('\n', '<br/>')
              "
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-footer class="pa-8 d-block mt-2">
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
    </v-footer>
  </div>
</template>
