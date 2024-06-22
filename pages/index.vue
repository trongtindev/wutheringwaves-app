<script setup lang="ts">
import { mdiGithub, mdiChevronRight } from '@mdi/js';

// uses
const app = useApp();
const i18n = useI18n();
const localePath = useLocalePath();

// states
const faqs = ref<number[]>([0, 1, 2, 3, 4]);

// functions
const openGithubRepo = () => {
  window.open(app.githubRepo);
};

// seo meta
const title = 'wutheringwaves.app';
useHead({ title });
useSeoMeta({
  title: title,
  description: i18n.t('meta.description')
});
</script>

<template>
  <div>
    <v-card class="pa-4 rounded border">
      <div class="text-center">
        <v-chip
          :prepend-icon="mdiGithub"
          :text="`${app.name} (${app.version})`"
          @click="openGithubRepo"
        />
      </div>

      <div class="text-center mt-4">
        <div>
          <h1>{{ i18n.t('meta.title') }}</h1>
        </div>
        <div class="mt-2">
          <h3>{{ i18n.t('meta.description') }}</h3>
        </div>
      </div>
    </v-card>

    <!-- shortcuts -->
    <v-card class="mt-4">
      <v-card-title>
        {{ $t('common.shortcuts') }}
      </v-card-title>
      <v-divider />

      <v-row>
        <v-col cols="12" md="6">
          <v-list>
            <v-list-item
              :to="localePath('/convene-history')"
              :title="$t('convene.history.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/convene-history/global')"
              :title="$t('convene.globalStats.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/convene-history/card-generator')"
              :title="$t('convene.cardGenerator.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/todo-list')"
              :title="$t('todoList.title')"
              :append-icon="mdiChevronRight"
            />
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <v-list>
            <v-list-item
              :to="localePath('/echos')"
              :title="$t('echos.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/weapons')"
              :title="$t('weapons.title')"
              :append-icon="mdiChevronRight"
            />
            <v-list-item
              :to="localePath('/characters')"
              :title="$t('characters.title')"
              :append-icon="mdiChevronRight"
            />
          </v-list>
        </v-col>
      </v-row>
    </v-card>

    <!-- faqs -->
    <div class="mt-4">
      <v-expansion-panels>
        <v-expansion-panel v-for="index in faqs" :key="index">
          <v-expansion-panel-title class="font-weight-bold">
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
