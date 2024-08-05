<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { ICharacter } from '~/interfaces/character';

// uses
const resource = useResources();
const calculator = useCalculator();
</script>

<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center">
        <v-divider />
      </v-col>
      <v-col class="text-h6 text-center">
        {{ $t('calculator.builder.rotation.title') }}
      </v-col>
      <v-col class="d-flex align-center">
        <v-divider />
      </v-col>
    </v-row>

    <v-row> </v-row>
  </div>
</template>
