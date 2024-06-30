<script setup lang="ts">
import type { IListResponse } from '@/interfaces/api';
import type { IComment } from '@/interfaces/comment';
import { mdiSend, mdiImageOutline, mdiAlert, mdiTrashCan } from '@mdi/js';
import type { IFile } from '~/interfaces/file';

const props = defineProps<{
  channel: string;
  flat?: boolean;
  hideTitle?: boolean;
}>();

// uses
const api = useApi();
const auth = useAuth();
const i18n = useI18n();
const fileChoose = useFileDialog({
  accept: 'image/png, image/jpg, image/webp, image/jpeg'
});
const runtimeConfig = useRuntimeConfig();

// states
const state = ref<'' | 'submit' | 'loading'>('loading');
const data = ref<IListResponse<IComment>>();
const limit = ref(20);
const offset = ref(0);
const page = ref(1);
const content = ref<string>();
const attachments = ref<
  {
    id: string;
    file: File;
    status: '' | 'uploaded' | 'upload_error';
    error?: string;
    result?: IFile;
    progress?: number;
  }[]
>([]);

// functions
const loadData = (parent?: IComment) => {
  if (import.meta.server) {
    throw new Error('Cannot run this on server-side!');
  }

  state.value = 'loading';
  api
    .getInstance()
    .get<IListResponse<IComment>>(`/comments`, {
      params: {
        channel: channel.value,
        limit: limit.value,
        offset: offset.value,
        parent: parent ? parent.id : undefined
      }
    })
    .then((result) => {
      data.value = result.data;
      content.value = '';
    })
    .catch((error) => {
      data.value = {
        total: 0,
        items: []
      };
      // TODO: handle error
      console.error(error);
    })
    .finally(() => {
      state.value = '';
    });
};

const uploadFile = (id: string) => {
  const getIndex = () => {
    const index = attachments.value.findIndex((e) => e.id === id);
    if (index < 0) throw new Error(`not found #${id}`);
    return index;
  };

  attachments.value[getIndex()].status = '';
  api
    .getInstance()
    .post<IFile>(
      'files',
      {
        file: attachments.value[getIndex()].file
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (e) => {
          attachments.value[getIndex()].progress = e.progress;
        }
      }
    )
    .then((result) => {
      attachments.value[getIndex()].result = result.data;
      attachments.value[getIndex()].status = 'uploaded';
    })
    .catch((error) => {
      console.error(error);
      attachments.value[getIndex()].error = error.message;
      attachments.value[getIndex()].status = 'upload_error';
    });
};

// computed
const total = computed(() => {
  return 0;
});

const channel = computed(() => {
  const path = props.channel.replace(`${i18n.locale.value}/`, '');
  return `${runtimeConfig.public.SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
});

const isContentError = computed<boolean>(() => {
  if (content.value) {
    return content.value.length < 6 || content.value.length > 500;
  }
  return false;
});

const canSubmit = computed<boolean>(() => {
  return `${content.value}`.length > 0 && !isContentError.value;
});

const pages = computed(() => {
  if (data.value) {
    return Math.ceil(data.value.total / limit.value);
  }
  return 0;
});

// events
const onSubmit = () => {
  state.value = 'submit';
  api
    .getInstance()
    .post<IComment>(`/comments`, {
      channel: channel.value,
      content: content.value,
      attachments: attachments.value
        .filter((e) => e.result)
        .map((e) => e.result?.id)
    })
    .then(() => {
      attachments.value = [];
      loadData();
    })
    .catch((error) => {
      // TODO: handle error
      console.log(error);
      alert(error);
    })
    .finally(() => {
      state.value = '';
    });
};

const onPressedAddAttachment = () => fileChoose.open();

const onPressedDeleteAttachment = (id: string) => {
  const index = attachments.value.findIndex((e) => e.id === id);
  if (index >= 0) {
    const result = attachments.value[index].result;
    if (result) {
      api.getInstance().delete(`files/${result.id}`);
    }

    attachments.value.splice(index, 1);
  }
};

// changes
watch(fileChoose.files, (value) => {
  Array.from(value!).forEach((file) => {
    const id = randomId();
    console.log(file);
    attachments.value.push({
      id,
      file: file,
      status: ''
    });
    uploadFile(id);
  });
});

watch(
  () => props.channel,
  () => {
    data.value = null as any;
    loadData();
  }
);

// lifecycle
onMounted(() => loadData());
</script>

<template>
  <v-card
    :class="{
      'border-none': props.flat
    }"
  >
    <v-card-title v-if="!props.hideTitle">
      {{ $t('Comments') }} ({{ total }})
    </v-card-title>
    <v-divider v-if="!props.hideTitle" />

    <v-card-text>
      <client-only>
        <v-form @submit.prevent="onSubmit">
          <v-textarea
            v-model="content"
            :disabled="!auth.isLoggedIn || state != ''"
            :loading="state == 'submit'"
            :hide-details="true"
            :placeholder="$t('Write your comment here...')"
            :rows="1"
            :max-rows="10"
            :auto-grow="true"
            :error="isContentError"
          />

          <v-row class="mt-2">
            <v-col>
              <v-btn
                class="border"
                variant="text"
                :disabled="state != '' || !auth.isLoggedIn"
                @click="onPressedAddAttachment"
              >
                <v-icon :icon="mdiImageOutline" color="white" />
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-end">
              <v-btn
                type="submit"
                :loading="state == 'submit'"
                :disabled="!canSubmit || state != '' || !auth.isLoggedIn"
                :prepend-icon="mdiSend"
                :text="$t('comments.submit')"
              />
            </v-col>
          </v-row>
        </v-form>

        <div>
          <v-row v-if="attachments.length > 0" class="mt-2">
            <v-col
              v-for="(element, index) in attachments"
              :key="index"
              cols="6"
              sm="3"
              md="2"
            >
              <v-responsive class="border rounded" :aspect-ratio="1">
                <!-- uploaded -->
                <v-hover v-if="element.status === 'uploaded' && element.result">
                  <template #default="hover">
                    <v-img
                      v-bind="hover.props"
                      :src="element.result.url"
                      class="w-100 h-100"
                      cover
                    >
                      <div
                        v-if="hover.isHovering"
                        class="d-flex align-center justify-center h-100 w-100"
                      >
                        <v-btn
                          :icon="mdiTrashCan"
                          size="x-small"
                          color="red"
                          @click="() => onPressedDeleteAttachment(element.id)"
                        />
                      </div>
                    </v-img>
                  </template>
                </v-hover>

                <!-- upload error -->
                <div
                  v-else-if="element.status === 'upload_error'"
                  class="d-flex align-center justify-center h-100 w-100"
                >
                  <div>
                    <div class="text-center">
                      <v-icon :icon="mdiAlert" color="error" class="mb-2" />
                    </div>
                    <div class="text-center">
                      {{ element.error }}
                    </div>
                    <div class="text-center mt-2">
                      <v-btn
                        :text="$t('common.retry')"
                        @click="() => uploadFile(element.id)"
                      />
                    </div>
                  </div>
                </div>

                <!-- uploading -->
                <div
                  v-else
                  class="d-flex align-center justify-center h-100 w-100"
                >
                  <v-progress-circular
                    v-model="element.progress"
                    :indeterminate="true"
                  />
                </div>
              </v-responsive>
            </v-col>
          </v-row>
        </div>
      </client-only>
    </v-card-text>
    <v-divider />

    <client-only>
      <v-list v-if="!data">
        <v-skeleton-loader
          v-for="index in 5"
          :key="index"
          type="list-item-avatar-two-line"
        />
      </v-list>
      <v-card-text v-else-if="data.total === 0">
        <v-alert color="info" :text="$t('comments.empty')" />
      </v-card-text>

      <v-card-text v-else>
        <comments-item
          v-for="(element, index) in data.items"
          :key="index"
          :data="element"
          :class="{
            'mt-2': index > 0
          }"
        />
      </v-card-text>

      <v-divider v-if="pages > 0" />
      <v-card-actions v-if="pages > 0" class="d-flex justify-center">
        <v-pagination v-model="page" :length="pages" />
      </v-card-actions>
    </client-only>
  </v-card>
</template>
