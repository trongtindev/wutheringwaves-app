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
const item = id ? (await api.get<IPost>(`posts/${id}`)).data : undefined;
const allCategories =
  await api.get<IListResponse<IPostCategory>>('posts/categories');

// states
const editor = ref<Editor>();
const localizationTab = ref(i18n.locale.value);
const titleLocalized = ref<{ [key: string]: string }>({});
const descriptionLocalized = ref<{ [key: string]: string }>({});
const contentLocalized = ref<{ [key: string]: string }>({});
const locale = ref<string>(item ? item.locale : i18n.locale.value);
const locales = ref<string[]>(item ? item.locales : []);
const thumbnail = ref<IFile | undefined>(item ? item.thumbnail : undefined);
const slug = ref(item ? item.slug : undefined);
const state = ref<'' | 'submit'>('');
const categories = ref<string[]>(item ? item.categories.map((e) => e.id) : []);
const keywords = ref<string>(
  item ? item.keywords : 'wuthering waves guide, wuthering guide'
);
const attachments = ref<IFile[]>([]);
const allowDiscussion = ref(true);
const allowRating = ref(true);

if (item) {
  titleLocalized.value = {};
  titleLocalized.value[item.locale] = item.title;

  descriptionLocalized.value = {};
  descriptionLocalized.value[item.locale] = item.description;
}

// computed
const localizations = computed(() => {
  if (locales.value) {
    return [locale, ...locales.value.filter((e) => e != locale.value)];
  }
  return [locale.value];
});

// functions
const updateOrPublish = () => {
  state.value = 'submit';

  api
    .post<IPost>(item ? `posts/${item.id}` : 'posts', {
      title: titleLocalized.value[locale.value],
      titleLocalized: Object.fromEntries(
        locales.value.map((e) => {
          return [e, titleLocalized.value[e]];
        })
      ),
      description: descriptionLocalized.value[locale.value],
      descriptionLocalized: Object.fromEntries(
        locales.value.map((e) => {
          return [e, descriptionLocalized.value[e]];
        })
      ),
      content: contentLocalized.value[locale.value],
      contentLocalized: Object.fromEntries(
        locales.value.map((e) => {
          return [e, contentLocalized.value[e]];
        })
      ),
      categories: categories.value,
      thumbnail: thumbnail.value ? thumbnail.value.id : undefined,
      locale: locale.value,
      locales: locales.value,
      attachments: attachments.value.map((e) => e.id),
      keywords: keywords.value
    })
    .then((result) => {
      router.push(localePath(`/posts/${result.data.slug}`));
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
  () => localizationTab.value,
  (locale) => {
    const content = contentLocalized.value[locale];
    editor.value?.commands.setContent(content);
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

useApp().title = item
  ? i18n.t('guides.actions.edit')
  : i18n.t('guides.editor.title');
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

          <v-card-text>
            <v-text-field
              v-model="titleLocalized[localizationTab]"
              :label="$t('guides.editor._title.label')"
              :placeholder="$t('guides.editor._title.placeholder')"
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
        <!-- thumbnail -->
        <guides-editor-thumbnail
          :default-value="thumbnail"
          @on-file="(val) => (thumbnail = val)"
        />

        <!-- seo -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.editor.seo') }}
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="slug"
              :label="$t('guides.editor.seo.url.label')"
              :placeholder="$t('guides.editor.seo.url.placeholder')"
              :readonly="true"
              :disabled="state != ''"
            />

            <v-textarea
              v-model="keywords"
              :label="$t('guides.editor.seo.keywords.label')"
              :placeholder="$t('guides.editor.seo.keywords.placeholder')"
              :hide-details="true"
              :disabled="state != ''"
            />
          </v-card-text>
        </v-card>

        <!-- categories -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.editor.categories.title') }}
          </v-card-title>

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
        </v-card>

        <!-- localization -->
        <v-card class="mt-2">
          <v-card-title>
            {{ $t('guides.editor.localization.title') }}
          </v-card-title>

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
              :items="i18n.locales.value.filter((e) => e.code !== locale)"
              :hide-details="true"
              :multiple="true"
              :disabled="state != ''"
              item-title="name"
              item-value="code"
            />
          </v-card-text>
        </v-card>

        <!-- options -->
        <v-card class="mt-2" :disabled="true">
          <v-card-title>
            {{ $t('guides.editor.options.title') }}
          </v-card-title>

          <v-list-item :title="$t('guides.editor.allowDiscussion')">
            <template #append>
              <v-switch v-model="allowDiscussion" :hide-details="true" />
            </template>
          </v-list-item>

          <v-list-item :title="$t('guides.editor.allowRating')">
            <template #append>
              <v-switch v-model="allowRating" :hide-details="true" />
            </template>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-app-bar location="bottom" class="pl-1 pr-1">
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
        :text="item ? $t('guides.editor.update') : $t('guides.editor.publish')"
        :disabled="state != ''"
        :loading="state == 'submit'"
        @click="() => updateOrPublish()"
      />
    </v-app-bar>

    <roles-required
      :roles="['Owner', 'Manager', 'Moderator', 'Content Writer']"
      type="any"
    />
  </client-only>
</template>
