<script setup lang="ts">
// uses
const i18n = useI18n();
const dialog = useDialog();

// states
const show = ref(true);

// events
const onPressedCancel = () => {
  if (!current.value) return;
  if (current.value.onCancel) {
    current.value.onCancel();
  }
  show.value = false;
};

const onPressedConfirm = () => {
  if (!current.value) return;
  if (current.value.onConfirm) {
    current.value.onConfirm();
  }
  show.value = false;
};

// changes
watch(show, (value) => {
  if (value) {
    if (current.value) {
      if (current.value.onOpen) {
        current.value.onOpen();
      }
    }
  } else {
    // commit
    if (current.value) {
      if (current.value.onClose) {
        current.value.onClose();
      }
    }

    // remove first
    dialog.queues.shift();
  }
});

watch(dialog.queues, (value) => {
  // if dialog in queues
  show.value = value.length > 0;
});

// computed
const current = computed(() => {
  if (dialog.queues.length == 0) {
    return null;
  }
  return dialog.queues[0];
});

const cancelButtonText = computed(() => {
  if (current.value) {
    if (current.value.cancelButtonText) {
      return current.value.cancelButtonText;
    }
  }
  return i18n.t('dialog.close');
});

const confirmButtonText = computed(() => {
  if (current.value) {
    if (current.value.confirmButtonText) {
      return current.value.confirmButtonText;
    }
  }
  return i18n.t('dialog.confirm');
});
</script>

<template>
  <v-sheet v-if="current">
    <v-dialog
      v-model="show"
      :width="current.width ?? 480"
      :scrollable="true"
      :persistent="current.persistent"
    >
      <v-card>
        <v-card-title class="text-center">
          {{ current.title }}
        </v-card-title>
        <v-divider />

        <v-card-text>
          <div
            :innerHTML="`${current.content}`.replaceAll('\n', '<br/>')"
            class="text-center"
          />
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn :text="cancelButtonText" @click="onPressedCancel" />
          <v-btn
            v-if="current.onConfirm"
            :text="confirmButtonText"
            :color="current.confirmButtonColor"
            @click="onPressedConfirm"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
