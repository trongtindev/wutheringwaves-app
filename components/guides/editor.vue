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
  mdiTableRowRemove
} from '@mdi/js';
import { Editor, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextAlign from '@tiptap/extension-text-align';

// define
const emits = defineEmits<{
  (e: 'on-updated', html: string);
}>();

const props = defineProps<{
  readonly?: boolean;
}>();

// states
const editor = ref<Editor>();

// lifecycle
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Document.configure({}),
      Paragraph.configure(),
      Text.configure(),
      Blockquote.configure(),
      CodeBlock.configure(),
      Heading.configure(),
      Image.configure({
        inline: true
      }),
      Dropcursor.configure(),
      ListItem.configure(),
      BulletList.configure(),
      OrderedList.configure(),
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
      History.configure({
        depth: 10
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?';
          }

          return 'Can you add some further context?';
        }
      }),
      Bold.configure(),
      Italic.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: `<p>The Document extension is required. Though, you can write your own implementation, e. g. to give it custom name.</p>  <h2>Heading</h2>
        <p style="text-align: center">first paragraph</p>
        <p style="text-align: right">second paragraph</p>`,
    onUpdate: ({ editor }) => {
      emits('on-updated', editor.getHTML());
    }
  });
});

onUnmounted(() => editor.value?.destroy());
</script>

<template>
  <client-only>
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
      <editor-content :editor="editor" />

      <!-- <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }">
        <div class="bubble-menu">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            Bold
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            Italic
          </button>
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            Strike
          </button>
        </div>
      </bubble-menu> -->
    </div>
  </client-only>
</template>
