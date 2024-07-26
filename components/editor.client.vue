<script setup lang="ts">
import {
  mdiImage,
  mdiLink,
  mdiLinkOff,
  mdiFormatBold,
  mdiFormatQuoteOpen,
  mdiFormatItalic,
  mdiUndo,
  mdiRedo,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatAlignCenter,
  mdiFormatAlignJustify,
  mdiTable,
  mdiTableColumnPlusAfter,
  mdiTableColumnPlusBefore,
  mdiTableCancel,
  mdiTableMergeCells,
  mdiTableSplitCell,
  mdiTableRowPlusAfter,
  mdiTableRowPlusBefore,
  mdiTableColumnRemove,
  mdiTableRowRemove,
  mdiImageText,
  mdiYoutube
} from '@mdi/js';
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3';
import type { IFile } from '~/interfaces/file';

// define
const emits = defineEmits<{
  (e: 'on-updated', html: string);
  (e: 'on-initialized', editor: Editor);
}>();

const props = defineProps<{
  readonly?: boolean;
  defaultContent?: string;
}>();

// uses
const api = useApi();
const i18n = useI18n();
const notification = useNotification();

// states
const editor = ref<Editor>();
const fileDialog = useFileDialog({
  accept: 'image/png,image/jpg,image/jpeg,image/webp',
  multiple: true
});

// functions
const toggleFigure = () => {
  if (editor.value!.can().imageToFigure()) {
    editor.value!.chain().focus().imageToFigure().run();
  } else if (editor.value!.can().figureToImage()) {
    editor.value!.chain().focus().figureToImage().run();
    editor.value!.chain().insertContent('\n').run();
  }
};

const addYoutube = () => {
  const src = window.prompt('Enter URL');
  if (!src) return;
  editor.value!.chain().focus().setYoutubeVideo({ src }).run();
};

const uploadFiles = async (files: File[]) => {
  const tasks = files.map(async (file) => {
    const nid = await notification.create({
      title: i18n.t('common.uploading'),
      message: file.name,
      persistent: true
    });
    const result = await api.post<IFile>(
      'files',
      {
        file
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (e) => {
          notification.update(nid, {
            progress: e.progress ? e.progress * 100 : undefined
          });
        }
      }
    );
    notification.remove(nid);

    editor
      .value!.chain()
      .focus()
      .setFigure({
        fid: result.data.id,
        src: result.data.url,
        caption: file.name
      })
      .run();
  });
  Promise.all(tasks);
};

// changes
watch(
  () => fileDialog.files.value,
  (newValue) => {
    if (!newValue) return;
    const files = Array.from(Array(newValue.length).keys()).map((index) => {
      return newValue.item(index)!;
    });
    if (files.length <= 0) return;
    uploadFiles(files);
  }
);

// watch(
//   () => props.readonly,
//   (newValue) => {
//     if (!editor.value) return;
//   }
// );

// lifecycle
onMounted(async () => {
  const { StarterKit } = await import('@tiptap/starter-kit');
  const { Table } = await import('@tiptap/extension-table');
  const { TableCell } = await import('@tiptap/extension-table-cell');
  const { TableHeader } = await import('@tiptap/extension-table-header');
  const { TableRow } = await import('@tiptap/extension-table-row');
  const { Youtube } = await import('@tiptap/extension-youtube');
  const { CharacterCount } = await import('@tiptap/extension-character-count');
  const { BubbleMenu } = await import('@tiptap/extension-bubble-menu');
  const { TextAlign } = await import('@tiptap/extension-text-align');
  const { Image } = await import('@tiptap/extension-image');
  const { Figure } = await import('~/tiptap/figure');

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#ffffff'
        }
      }),
      Table.configure({ resizable: true }),
      TableCell.configure(),
      TableHeader.configure(),
      TableRow.configure(),
      Youtube.configure({
        inline: false,
        ccLanguage: 'en'
      }),
      BubbleMenu.configure({
        element: document.querySelector('.menu') as HTMLElement
      }),
      CharacterCount.configure({}),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Image.configure({ inline: true }),
      Figure.configure()
    ],
    content: props.defaultContent || '',
    onUpdate: ({ editor }) => {
      emits('on-updated', editor.getHTML());
    }
  });
  editor.value.on('create', () => emits('on-initialized', editor.value!));
});

onUnmounted(() => editor.value?.destroy());
</script>

<template>
  <client-only>
    <template #fallback>
      <div class="text-center">
        <v-progress-circular :indeterminate="true" />
      </div>
    </template>

    <div v-if="editor">
      <!-- toolbar -->
      <div class="d-flex flex-wrap ga-2">
        <!-- undo / redo -->
        <v-btn
          :title="$t('editor.undo')"
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiUndo"
          :disabled="!editor.can().undo()"
          @click="editor.chain().focus().undo().run()"
        />

        <v-btn
          :title="$t('editor.redo')"
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiRedo"
          :disabled="!editor.can().redo()"
          @click="editor.chain().focus().redo().run()"
        />

        <!-- vertical line -->
        <v-divider vertical />

        <!-- image -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiImage"
          @click="() => fileDialog.open({ reset: true })"
        />
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiImageText"
          :disabled="
            !editor.can().imageToFigure() && !editor.can().figureToImage()
          "
          @click="() => toggleFigure()"
        />

        <v-divider vertical />
        <!-- youtube -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiYoutube"
          @click="() => addYoutube()"
        />

        <!-- link -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiLink"
        />
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiLinkOff"
        />
      </div>

      <!-- line -->
      <v-divider class="mt-2 mb-2" />

      <!-- toolbar -->
      <div class="d-flex flex-wrap ga-2">
        <!-- bold -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatBold"
          :active="editor.isActive('bold')"
          @click="editor.chain().focus().toggleBold().run()"
        />

        <!-- italic -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatItalic"
          :active="editor.isActive('italic')"
          @click="editor.chain().focus().toggleItalic().run()"
        />

        <!-- vertical line -->
        <v-divider vertical />

        <!-- align -->
        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatAlignLeft"
          :active="editor.isActive({ textAlign: 'left' })"
          @click="editor.chain().focus().setTextAlign('left').run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatAlignCenter"
          :active="editor.isActive({ textAlign: 'center' })"
          @click="editor.chain().focus().setTextAlign('center').run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatAlignRight"
          :active="editor.isActive({ textAlign: 'right' })"
          @click="editor.chain().focus().setTextAlign('right').run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatAlignJustify"
          :active="editor.isActive({ textAlign: 'justify' })"
          @click="editor.chain().focus().setTextAlign('justify').run()"
        />

        <!-- line -->
        <v-divider vertical />

        <!-- blockquote -->
        <v-btn
          :title="$t('editor.toggleBlockquote')"
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiFormatQuoteOpen"
          :active="editor.isActive('blockquote')"
          @click="editor.chain().focus().toggleBlockquote().run()"
        />

        <!-- line -->
        <v-divider vertical />

        <!-- table -->
        <v-btn
          :title="$t('editor.insertTable')"
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTable"
          :active="editor.isActive('table')"
          @click="
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          "
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableRowPlusAfter"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().addRowAfter().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableRowPlusBefore"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().addRowBefore().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableRowRemove"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().deleteRow().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableColumnPlusBefore"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().addColumnBefore().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableColumnPlusAfter"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().addColumnAfter().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableColumnRemove"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().deleteColumn().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableMergeCells"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().mergeCells().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableSplitCell"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().splitCell().run()"
        />

        <v-btn
          variant="text"
          class="border rounded"
          color="white"
          size="x-small"
          :icon="mdiTableCancel"
          :disabled="!editor.isActive('table')"
          @click="editor.chain().focus().deleteTable().run()"
        />
      </div>

      <!-- line -->
      <v-divider class="mt-2 mb-2" />

      <!-- editor -->
      <editor-content v-if="editor" :editor="editor" />
      <div v-else class="text-center">
        <v-progress-circular :indeterminate="true" />
      </div>

      <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }">
        <v-card :elevation="3">
          <v-card-text class="d-flex ga-2 pa-2">
            <!-- bold -->
            <v-btn
              variant="text"
              class="border rounded"
              color="white"
              size="x-small"
              :icon="mdiFormatBold"
              :active="editor.isActive('bold')"
              @click="editor.chain().focus().toggleBold().run()"
            />

            <!-- italic -->
            <v-btn
              variant="text"
              class="border rounded"
              color="white"
              size="x-small"
              :icon="mdiFormatItalic"
              :active="editor.isActive('italic')"
              @click="editor.chain().focus().toggleItalic().run()"
            />
          </v-card-text>
        </v-card>
      </bubble-menu>
    </div>
    <div v-else class="text-center">
      <v-progress-circular :indeterminate="true" />
    </div>
  </client-only>
</template>

