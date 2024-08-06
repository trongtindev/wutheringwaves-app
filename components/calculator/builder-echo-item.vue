<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { IEcho } from '~/interfaces/echo';
import { mdiSwapHorizontal } from '@mdi/js';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
  echoes: IEcho[];
}>();

// uses
const resources = useResources();
const calculator = useCalculator();

// states
const show = ref(0);
const showEchoes = ref();
const setEchoFor = ref();

// events
const onPressed = (index: number) => {
  if (!calculator.participants[props.index].echoes[index].item) {
    OnsetEchoFor(index);
    return;
  }

  show.value = index;
};

const OnsetEchoFor = (index: number) => {
  setEchoFor.value = index;
  showEchoes.value = true;
};

const onSelectedEcho = async (echo: IEcho) => {
  showEchoes.value = false;
  show.value = setEchoFor.value;
  const data = await resources.getEchoData(echo.slug);
  calculator.participants[props.index].echoes[setEchoFor.value].item = echo;
  calculator.participants[props.index].echoes[setEchoFor.value].data = data;
};

// computed
const totalCost = computed(() => {
  return props.item.echoes.reduce((prev, e) => {
    return prev + (e.item ? e.item.cost : 0);
  }, 0);
});
</script>

<template>
  <div>
    <v-row class="mb-0">
      <v-col
        v-for="(echo, j) in item.echoes"
        :key="j"
        class="d-flex justify-center"
      >
        <div class="position-relative">
          <v-badge>
            <template v-if="echo.item" #badge>
              {{ echo.item.cost }}
            </template>

            <v-card
              v-bind="props"
              :border="true"
              :active="j === show"
              class="rounded-circle"
              @click="() => onPressed(j)"
            >
              <v-avatar :size="64">
                <v-img v-if="echo.item" :src="echo.item.icon" />
                <span v-else>+</span>
              </v-avatar>
            </v-card>
          </v-badge>

          <div class="position-absolute" style="right: -8px; bottom: -8px">
            <v-btn
              v-if="echo.item"
              :icon="mdiSwapHorizontal"
              :color="j === show ? 'primary' : undefined"
              :elevation="3"
              size="x-small"
              @click="() => OnsetEchoFor(j)"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- warning cost -->
    <div v-if="totalCost > 12" class="mt-2">
      <base-alert
        :text="$t('calculator.builder.echoes.costCapped')"
        color="warning"
      />
    </div>

    <calculator-builder-echo-item-slot :item="item.echoes[show]" />

    <!-- echo dialog -->
    <v-dialog v-model="showEchoes" :scrollable="true" :max-width="600">
      <dialog-echoes
        @on-close="() => (showEchoes = false)"
        @on-select="onSelectedEcho"
      />
    </v-dialog>
  </div>
</template>
