<script setup lang="ts">
import type { ICharacter } from '~/interfaces/character';

defineProps<{
  item: ICharacter;
}>();
</script>

<template>
  <div>
    <v-row :no-gutters="true" class="border-b pt-2 mb-2">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <v-sheet
          :width="18"
          :height="18"
          class="rounded mr-2"
          :class="`bg-${item.attribute.slug}`"
        />
        <h2 class="text-h6">
          <slot name="title" />
        </h2>
      </v-col>

      <v-col cols="12" sm="6">
        <slot name="append" />
      </v-col>
    </v-row>

    <div>
      <slot />
    </div>
  </div>
</template>
