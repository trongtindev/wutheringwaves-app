<template>
  <v-card-title>
    <v-row>
      <v-col class="d-flex align-center">
        <slot name="title" />
      </v-col>

      <v-col class="d-flex align-center justify-end">
        <slot name="actions" />
      </v-col>
    </v-row>
  </v-card-title>
  <v-divider />
</template>
