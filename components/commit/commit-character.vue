<script setup lang="ts">
import type { ILocalized } from '~/interfaces/common';

// uses
const api = useApi();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const dialog = useDialog();

// fetch
const slug = `${route.query.slug}`;
const { data: result, error } = await useFetch<string>(
  `https://raw.githubusercontent.com/trongtindev/wutheringwaves-app/main/resources/characters/${slug}.json`,
);
if (error.value) {
  throw createError({
    message: error.value?.message,
    statusCode: error.value?.statusCode,
  });
}
const data = JSON.parse(result.value!);

// states
const status = ref<'' | 'submit'>('');

const quoteLocalized = ref({
  en: data.quote,
  ...(data.quoteLocalized || {}),
} as ILocalized);

const descriptionLocalized = ref({
  en: data.description,
  ...(data.descriptionLocalized || {}),
} as ILocalized);

const skills = ref(data.skills || []);

// events
const onSkillsChanged = (index: number, data: any) => {
  console.log('onSkillsChanged', index, data);
  skills.value[index] = data;
};

const onSubmit = () => {
  const locales = i18n.locales.value
    .filter((e) => e.code != 'en')
    .map((e) => e.code);

  status.value = 'submit';
  api
    .post<{ html_url: string }>('github/commit', {
      path: `resources/characters/${slug}.json`,
      data: JSON.stringify({
        ...data,
        quote: quoteLocalized.value['en'],
        quoteLocalized: Object.fromEntries(
          locales.map((e) => {
            return [e, quoteLocalized.value[e]];
          }),
        ),
        description: descriptionLocalized.value['en'],
        descriptionLocalized: Object.fromEntries(
          locales.map((e) => {
            return [e, descriptionLocalized.value[e]];
          }),
        ),
        skills: skills.value,
      }),
    })
    .then((result) => {
      dialog.show({
        title: i18n.t('common.successfully'),
        content: i18n.t('commit.successfully'),
        onConfirm: () => {
          window.open(result.data.html_url);
        },
        confirmButtonText: i18n.t('commit.viewPullRequest'),
      });
      router.push(localePath(`/characters/${slug}`));
    })
    .finally(() => {
      status.value = '';
    });
};
</script>

<template>
  <div>
    <!-- overview -->
    <div class="text-h6 mb-2">
      {{ $t('commit.character.overview') }}
    </div>
    <v-expansion-panels>
      <commit-localized-field
        v-model="quoteLocalized"
        :title="$t('commit.character.quote')"
        :localized="quoteLocalized"
      />

      <commit-localized-field
        v-model="descriptionLocalized"
        :title="$t('commit.character.description')"
        :localized="descriptionLocalized"
      />
    </v-expansion-panels>

    <!-- skills -->
    <div class="text-h6 mb-2 mt-2">
      {{ $t('commit.character.skills') }}
    </div>

    <v-expansion-panels v-for="(element, index) in skills" :key="index">
      <commit-character-skills
        :data="element"
        :index="index"
        @on-changed="(val) => onSkillsChanged(index, val)"
      />
    </v-expansion-panels>

    <v-app-bar location="bottom" class="pr-2 border-t">
      <v-spacer />
      <v-btn
        :text="$t('common.submit')"
        :disabled="status != ''"
        :loading="status === 'submit'"
        variant="tonal"
        color="primary"
        @click="() => onSubmit()"
      />
    </v-app-bar>
  </div>
</template>
