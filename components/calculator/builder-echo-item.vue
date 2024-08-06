<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { IEcho } from '~/interfaces/echo';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
  echoes: IEcho[];
}>();

// uses
const calculator = useCalculator();
</script>

<template>
  <div>
    <v-row>
      <v-col
        v-for="(element, j) in item.echoes"
        :key="j"
      >
        <div class="d-flex justify-center">
          <v-sheet
            class="border rounded-circle d-flex justify-center align-center"
          >
            <v-avatar :size="64"> ? </v-avatar>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
