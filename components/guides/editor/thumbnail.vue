<script setup lang="ts">
import type { IFile } from '~/interfaces/file';

// define
const emits = defineEmits<{
  (e: 'on-file', value?: IFile | undefined);
}>();
const props = defineProps<{
  defaultValue?: IFile | undefined;
}>();

// uses
const api = useApi();
const i18n = useI18n();
const dialog = useDialog();
const fileDialog = useFileDialog({
  accept: 'image/png,image/jpg,image/jpeg,image/webp',
  multiple: false,
});

// state
const thumbnail = ref<{
  file?: File;
  state: 'uploaded' | 'uploading' | 'error';
  result?: IFile;
  error?: string;
  progress?: number;
}>();

if (props.defaultValue) {
  thumbnail.value = {
    state: 'uploaded',
    result: props.defaultValue,
  };
}

// functions
const checkAndUploadThumbnail = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: file.type });
    const size = await new Promise<{ w: number; h: number }>(
      (resolve, reject) => {
        const image = new Image();
        image.src = (window.URL || window.webkitURL).createObjectURL(blob);
        image.onload = () => {
          resolve({ w: image.width, h: image.height });
        };
        image.onerror = reject;
      },
    );

    // validate
    if (
      !size.w ||
      !size.h ||
      size.w == size.h ||
      size.w < size.h ||
      size.w < 720
    ) {
      dialog.show({
        title: i18n.t('common.notice'),
        content: i18n.t('guides.editor.thumbnail.wrongSize'),
      });
      return;
    }

    // uploading
    thumbnail.value = {
      file,
      state: 'uploading',
    };
    const result = await api.post<IFile>(
      'files',
      {
        file,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          thumbnail.value = {
            file,
            state: 'uploading',
            progress:
              e.progress && e.progress < 100 ? e.progress * 100 : undefined,
          };
        },
      },
    );

    thumbnail.value = {
      file: undefined,
      state: 'uploaded',
      result: result.data,
      progress: undefined,
    };
    emits('on-file', result.data);
  } catch (error: any) {
    console.error(error);
    alert(error);
    thumbnail.value = undefined;
  }
};

// changes
watch(
  () => fileDialog.files.value,
  async (newValue) => {
    if (newValue == null) return;
    const file = newValue.item(0);
    if (file == null) return;

    checkAndUploadThumbnail(file);
  },
);
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('guides.editor.thumbnail.title') }}
    </v-card-title>

    <v-card
      class="rounded-t-0 border-none"
      :disabled="thumbnail && thumbnail.state == 'uploading'"
      @click="() => fileDialog.open({ reset: true })"
    >
      <v-img
        :src="thumbnail && thumbnail.result ? thumbnail.result.url : undefined"
        :aspect-ratio="1.91 / 1"
        cover
      >
        <template #placeholder>
          <div
            v-if="thumbnail && thumbnail.result"
            class="d-flex align-center justify-center h-100"
          >
            <v-progress-circular :indeterminate="true" />
          </div>
        </template>

        <template #default>
          <div
            v-if="thumbnail && thumbnail.state == 'uploading'"
            class="d-flex align-center justify-center h-100"
          >
            <v-progress-circular
              v-if="!thumbnail.progress || thumbnail.progress >= 100"
              :indeterminate="true"
            />
            <v-progress-circular v-else :model-value="thumbnail.progress" />
          </div>

          <div
            v-else-if="!thumbnail"
            class="d-flex align-center justify-center h-100 text-center"
          >
            {{ $t('guides.editor.thumbnail.placeholder') }}
          </div>
        </template>
      </v-img>
    </v-card>
  </v-card>
</template>
