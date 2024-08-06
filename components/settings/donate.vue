<script setup lang="ts">
const { DONATE_URL } = useRuntimeConfig().public;
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('donate.title') }}
    </v-card-title>
    <v-card-text>
      <div
        v-for="index in 4"
        :key="index"
        :class="{ 'mt-2': index > 0 }"
      >
        {{ $t(`donate.messages.${index}`) }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-card-btn
        :href="DONATE_URL"
        :text="$t('donate.buttons.kofi')"
        target="_blank"
      />
    </v-card-actions>
  </v-card>
</template>
