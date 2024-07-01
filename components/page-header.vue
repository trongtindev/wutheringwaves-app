<script setup lang="ts">
// uses
const slots = useSlots();
</script>

<template>
  <div class="mb-2">
    <v-row>
      <v-col cols="12" sm="8" class="d-flex title">
        <div>
          <h3 class="text-h5">
            <slot name="title" />
          </h3>
          <h4 v-if="slots.subtitle" class="text-subtitle-1">
            <slot name="subtitle" />
          </h4>
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="4"
        class="d-flex align-center flex-wrap ga-2 actions"
      >
        <slot name="actions" />
      </v-col>
    </v-row>
  </div>
</template>

<style>
@media only screen and (max-width: 600px) {
  .title {
    text-align: center;
  }

  .actions {
    justify-content: center;
  }
}

@media only screen and (min-width: 600px) {
  .title {
    align-items: center !important;
  }

  .actions {
    justify-content: flex-end !important;
  }
}
</style>
