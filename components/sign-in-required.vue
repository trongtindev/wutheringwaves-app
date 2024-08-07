<script setup lang="ts">
const show = ref(true);
</script>

<template>
  <div>
    <client-only>
      <v-overlay
        v-model="show"
        :contained="true"
        :persistent="true"
        class="w-100 h-100 d-flex align-center justify-center"
      >
        <v-card :max-width="480">
          <v-card-title class="text-center">
            {{ $t('common.signInRequired') }}
          </v-card-title>

          <v-card-text class="text-center">
            {{ $t('common.signInRequiredMessage') }}
          </v-card-text>
        </v-card>
      </v-overlay>
    </client-only>
  </div>
</template>
