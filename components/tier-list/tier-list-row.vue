<script setup lang="ts">
import type {
  ITierListRow,
  TierListItem,
  TierListType
} from '@/interfaces/tier-list';

const props = defineProps<{
  data: ITierListRow;
  type: TierListType;
  editor?: boolean;
}>();

const emits = defineEmits<{
  (e: 'on-drag-start', item: TierListItem): void;
  (e: 'on-drop', item?: TierListItem): void;
  (e: 'on-drag-enter'): void;
  (e: 'on-drag-leave'): void;
}>();

// uses
const router = useRouter();

// states
const dragCounter = ref(0);

// events
const onDragStart = (args: TierListItem) => {
  emits('on-drag-start', args);
};

const onDrop = (item?: TierListItem) => {
  dragCounter.value = 0;
  emits('on-drop', item);
};

const onDragEnter = () => {
  dragCounter.value += 1;
  if (dragCounter.value == 1) emits('on-drag-enter');
};

const onDragLeave = () => {
  dragCounter.value -= 1;
  if (dragCounter.value == 0) emits('on-drag-leave');
};

const onDragOver = (event: Event) => event.preventDefault();

// lifecycle
onMounted(() => {});
</script>

<template>
  <v-sheet
    class="d-flex"
    :draggable="props.editor"
    :ondrop="() => onDrop()"
    :ondragover="onDragOver"
    :ondragenter="onDragEnter"
    :ondragleave="onDragLeave"
  >
    <v-sheet
      class="rounded d-flex align-center justify-center text-lg"
      :width="175"
      :height="100"
      :color="props.data.color"
    >
      {{ props.data.label }}
    </v-sheet>

    <v-sheet
      v-for="(element, index) in props.data.items"
      :key="index"
      class="rounded border ml-2 d-flex align-center justify-center"
      :class="{
        draggable: index > 0,
        'ml-2': index > 0
      }"
      :ondrop="() => onDrop(element)"
      :ondragstart="() => onDragStart(element)"
      :draggable="props.editor"
    >
      <v-sheet
        class="rounded"
        :class="{
          'cursor-grab': props.editor
        }"
        :width="96"
        :height="96"
        :style="`background-size: cover;background-image: url(/${props.type}s/icons/${element.slug}.webp)`"
      />
    </v-sheet>
  </v-sheet>
</template>
