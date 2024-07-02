<script setup lang="ts">
import { mdiGithub, mdiChevronRight, mdiOpenInNew } from '@mdi/js';
import { useDisplay } from 'vuetify';

// uses
const app = useApp();
const i18n = useI18n();
const display = useDisplay();
const localePath = useLocalePath();

// states
const faqs = ref<number[]>([0, 1, 2, 3, 4]);
const masonryElement = ref();
const masonryInstance = ref();
const emitSetTimeout = ref();

// events
const onResize = () => initialize();

// functions
const initialize = (emit?: boolean) => {
  if (!masonryElement.value) {
    setTimeout(initialize, 50);
    return;
  }

  if (!emit) {
    if (emitSetTimeout.value) {
      clearTimeout(emitSetTimeout.value);
    }
    emitSetTimeout.value = setTimeout(() => initialize(true), 150);
    return;
  }

  if (display.mdAndUp.value) {
    masonryInstance.value = new window.Masonry(masonryElement.value, {
      itemSelector: '.masonry-tile'
    });
    console.log('ini');
  } else if (masonryInstance.value) {
    masonryInstance.value.destroy();
    masonryInstance.value = undefined;
    console.log('des');
  }
};

// lifecycle
onNuxtReady(initialize);
onUnmounted(() => {
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }
});

// seo meta
const title = 'astrite.app';

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
    <div ref="masonryElement" class="masonry" item-selector=".masonry-tile">
      <v-row class="mt-1">
        <v-col cols="12" sm="6" md="4" class="masonry-tile">
          <v-card v-resize="onResize" class="pa-4 rounded border">
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
                <h1 class="text-h4">Astrite.app</h1>
              </div>
              <div class="mt-1">
                <h2 class="text-h5">{{ i18n.t('meta.title') }}</h2>
              </div>
              <div class="mt-2">
                <h3 class="text-h6">{{ i18n.t('meta.description') }}</h3>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- current event -->
        <v-col cols="12" sm="6" md="4" class="masonry-tile">
          <v-card v-resize="onResize">
            <v-card-title>
              {{ $t('common.currentEvents') }}
            </v-card-title>
            <v-divider />

            <timeline-recently />
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
        </v-col>

        <!-- yourLastConvene -->
        <v-col cols="12" sm="6" md="4" class="masonry-tile">
          <v-card v-resize="onResize">
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
        </v-col>

        <!-- global convene -->
        <v-col cols="12" sm="6" md="4" class="masonry-tile">
          <v-card v-resize="onResize">
            <v-card-title>
              {{ $t('convene.global.title') }}
            </v-card-title>
            <v-divider />

            <convene-history-global-widget />
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
        </v-col>
      </v-row>
    </div>

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
  </div>
</template>
