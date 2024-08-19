<script setup lang="ts">
import type { Editor } from 'tinymce';
import type { IFile } from '~/interfaces/file';

// define
const emits = defineEmits<{
  (e: 'on-updated', html: string);
  (e: 'on-initialized', editor: Editor);
}>();

// uses
const api = useApi();
const i18n = useI18n();
const notification = useNotification();

// functions
const initialize = async () => {
  if (!window.tinymce) {
    setTimeout(() => initialize());
    return;
  }

  const container = document.querySelector('#tinymce-container');
  if (!container) {
    setTimeout(() => initialize());
    return;
  }

  const selectorId = `tinymce-${randomId()}`;
  const selectorElement = document.createElement('textarea');
  selectorElement.setAttribute('id', selectorId);
  container?.appendChild(selectorElement);

  const instances = await window.tinymce.init({
    license_key: 'gpl',
    selector: `#${selectorId}`,
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'image',
      'autoresize',
      'quickbars',
    ],
    menubar: 'file edit view insert format table',
    toolbar:
      'link image | undo redo | blocks | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat',
    visualblocks_default_state: true,
    a11y_advanced_options: true,
    file_picker_types: 'image',
    block_unsupported_drop: true,
    quickbars_insert_toolbar: true,
    content_css: 'dark',
    image_caption: true,
    content_style: 'img {max-width:100%};',
    images_upload_handler: (blobInfo, progress) => {
      return new Promise((resolve, reject) => {
        const nid = notification.create({
          title: i18n.t('common.uploading'),
          message: blobInfo.filename(),
          persistent: true,
        });
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        api
          .post<IFile>('files', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => progress((e.progress || 0) * 100),
          })
          .then((result) => {
            const url = new URL(result.data.url);
            url.searchParams.set('id', result.data.id);
            resolve(url.toString());
          })
          .catch(reject)
          .finally(() => notification.remove(nid));
      });
    },
    init_instance_callback: (instance) => emits('on-initialized', instance),
  });
  instances[0].on('change', () => {
    if (!window.tinymce.activeEditor) return;
    emits('on-updated', window.tinymce.activeEditor.getContent());
  });
  console.log('instances', instances);
};

// lifecycle
onMounted(() => {
  if (window.tinymce) {
    initialize();
    return;
  }

  const script = document.createElement('script');
  script.setAttribute(
    'src',
    'https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.2.1/tinymce.min.js',
  );
  script.setAttribute(
    'integrity',
    'sha512-zmlLhIesl+uwwzjoUz/izUsSjAMVb/7fH2ffCbJvYLepAvdvAq1T6ev9edZR8jwRKfM0OTaUyFVO1D7wAwXCEw==',
  );
  script.setAttribute('crossorigin', 'anonymous');
  script.setAttribute('referrerpolicy', 'no-referrer');
  script.onload = () => initialize();
  document.body.appendChild(script);
});

onBeforeUnmount(() => window.tinymce.remove());
</script>

<template>
  <client-only>
    <div id="tinymce-container"></div>
  </client-only>
</template>
