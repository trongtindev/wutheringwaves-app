<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { mdiPublish } from '@mdi/js';
import urlSlug from 'url-slug';
import type { IListResponse } from '~/interfaces/api';
import type { IFile } from '~/interfaces/file';
import type { IPost, IPostCategory } from '~/interfaces/post';
import { AxiosError } from 'axios';

// uses
const api = useApi();
const i18n = useI18n();
const auth = useAuth();
const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const localePath = useLocalePath();

// fetch
const id = typeof route.query.id === 'string' ? route.query.id : undefined;
const item = id
  ? await api.getInstance().get<IListResponse<IPost>>(`posts/${id}`)
  : undefined;
const allCategories = await api
  .getInstance()
  .get<IListResponse<IPostCategory>>('posts/categories');

// states
const editor = ref<Editor>();
const localizationTab = ref(i18n.locale.value);
const titleLocalized = ref<{ [key: string]: string }>({});
const descriptionLocalized = ref<{ [key: string]: string }>({});
const contentLocalized = ref<{ [key: string]: string }>({});
const locale = ref<string>(i18n.locale.value);
const locales = ref<string[]>([]);
const thumbnail = ref<IFile>();
const slug = ref();
const state = ref<'' | 'submit'>('');
const categories = ref<string[]>([]);

// computed
const localizations = computed(() => {
  if (locales.value) {
    return [locale, ...locales.value.filter((e) => e != locale.value)];
  }
  return [locale.value];
});

// functions
const saveDraft = () => {
  // TODO: save to local browser
};

const updateOrPublish = () => {
  state.value = 'submit';

  api
    .getInstance()
    .post<IPost>('posts', {
      title: titleLocalized.value[locale.value],
      titleLocalized: titleLocalized.value,
      description: descriptionLocalized.value[locale.value],
      descriptionLocalized: descriptionLocalized.value,
      content: contentLocalized.value[locale.value],
      contentLocalized: contentLocalized.value,
      categories: categories.value,
      thumbnail: thumbnail.value ? thumbnail.value.id : undefined,
      locale: locale.value,
      locales: locales.value
    })
    .then((result) => {
      router.push(localePath(`/guides/${result.data.slug}`));
    })
    .catch((error) => {
      console.error(error);

      if (error instanceof AxiosError && error.response) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: string[] = (error.response.data as any).message || [];
        dialog.show({
          title: i18n.t('common.error'),
          content: typeof errors === 'string' ? errors : errors.join('<br/>')
        });
      } else {
        dialog.show({
          title: i18n.t('error'),
          content: error.message
        });
      }
    })
    .finally(() => {
      state.value = '';
    });
};

// changes
watch(
  () => locale.value,
  () => {
    localizationTab.value = locale.value;
  }
);
watch(
  () => titleLocalized.value,
  () => {
    const title = titleLocalized.value[localizationTab.value];
    slug.value = title ? urlSlug(title) : '';
  }
);

// seo meta
const pageTitle = i18n.t('meta.guides.editor.title');

useApp().title = i18n.t('guides.editor.title');
useHead({
  title: pageTitle,
  meta: [
    {
      name: 'robots',
      content: 'noindex'
    }
  ]
});
</script>

<template>
  <client-only>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-tabs v-model="localizationTab" :disabled="state != ''">
            <v-tab
              v-for="(localization, index) in localizations"
              :key="index"
              :value="localization"
            >
              {{ localization }}
            </v-tab>
          </v-tabs>
          <v-divider />

          <v-card-text>
            <v-text-field
              v-model="titleLocalized[localizationTab]"
              :label="$t('guides.editor.title.label')"
              :placeholder="$t('guides.editor.title.placeholder')"
              :persistent-counter="true"
              :counter="160"
              :maxlength="160"
              :disabled="state != ''"
            />

            <v-textarea
              v-model="descriptionLocalized[localizationTab]"
              class="mt-2"
              :label="$t('guides.editor.description.label')"
              :placeholder="$t('guides.editor.description.placeholder')"
              :persistent-counter="true"
              :counter="300"
              :maxlength="300"
              :disabled="state != ''"
            />

            <lazy-editor
              :readonly="state != ''"
              @on-updated="(val) => (contentLocalized[localizationTab] = val)"
              @on-initialized="(val) => (editor = val)"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- publish -->
        <v-card>
          <v-card-title>
            {{ $t('common.publish') }}
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-text-field
              v-model="slug"
              :label="$t('guides.editor.url.label')"
              :placeholder="$t('guides.editor.url.placeholder')"
              :hide-details="true"
              :readonly="true"
              :disabled="state != ''"
            />
          </v-card-text>
          <v-divider />

          <v-card-actions>
            <v-btn
              :text="$t('common.saveDraft')"
              :disabled="true"
              @click="() => saveDraft()"
            />
            <v-spacer />

            <v-btn
              v-if="!auth.isSignedIn"
              color="primary"
              variant="flat"
              :prepend-icon="mdiPublish"
              :disabled="true"
              :text="$t('common.signInToContinue')"
            />
            <v-btn
              v-else
              color="primary"
              variant="flat"
              :prepend-icon="mdiPublish"
              :text="
                item ? $t('guides.editor.update') : $t('guides.editor.publish')
              "
              :disabled="state != ''"
              :loading="state == 'submit'"
              @click="() => updateOrPublish()"
            />
          </v-card-actions>
        </v-card>

        <!-- categories -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.editor.categories.title') }}
          </v-card-title>
          <v-divider />

          <v-card-text class="text-center">
            <v-select
              v-model="categories"
              :label="$t('guides.editor.categories.label')"
              :placeholder="$t('guides.editor.categories.placeholder')"
              :hide-details="true"
              :multiple="true"
              :items="allCategories.data.items"
              :item-title="
                (e) => {
                  if (e.nameLocalized[i18n.locale.value]) {
                    return e.nameLocalized[i18n.locale.value];
                  }
                  return e.name;
                }
              "
              :disabled="state != ''"
              item-value="id"
            />
          </v-card-text>
          <v-divider />
        </v-card>

        <!-- thumbnail -->
        <guides-editor-thumbnail @on-file="(val) => (thumbnail = val)" />

        <!-- localization -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.editor.localization.title') }}
          </v-card-title>
          <v-divider />

          <v-card-text class="text-center">
            <v-select
              v-model="locale"
              :label="$t('guides.editor.localization.primary')"
              :items="i18n.locales.value"
              :disabled="state != ''"
              item-title="name"
              item-value="code"
            />

            <v-select
              v-model="locales"
              :label="$t('guides.editor.localization.secondary')"
              :items="i18n.locales.value"
              :hide-details="true"
              :multiple="true"
              :disabled="state != ''"
              item-title="name"
              item-value="code"
            />
          </v-card-text>
          <v-divider />
        </v-card>

        <!-- discussion -->
        <!-- <v-card class="mt-2">
          <v-card-title>
            {{ $t('posts.discussion') }}
          </v-card-title>
          <v-divider />

          <v-list>
            <v-list-item :title="$t('posts.allowComments')">
              <template #append>
                <v-switch v-model="allowComments" :hide-details="true" />
              </template>
            </v-list-item>
          </v-list>
          <v-divider />
        </v-card> -->
      </v-col>
    </v-row>
  </client-only>
</template>
