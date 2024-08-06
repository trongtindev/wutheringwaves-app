<script setup lang="ts">
import { useDisplay } from 'vuetify';

// uses
const display = useDisplay();
const calculator = useCalculator();

// computed
const lite = computed(() => {
  return display.smAndDown.value;
});
</script>

<template>
  <client-only>
    <!-- disclaimer -->
    <base-alert :text="$t('calculator.builder.disclaimer')" color="warning" />

    <!-- teams -->
    <calculator-builder-team :lite />

    <!-- sequences -->
    <calculator-builder-sequences :lite />

    <!-- weapons -->
    <calculator-builder-weapon :lite />

    <!-- echoes -->
    <calculator-builder-echoes :lite />

    <!-- rotation -->
    <calculator-builder-rotation />

    <v-bottom-navigation
      v-model="calculator.participant"
      class="border-t hidden-md-and-up"
    >
      <v-btn :value="0" :text="$t('common.mainDPS')" />
      <v-btn :value="1" :text="$t('common.subDPS')" />
      <v-btn :value="2" :text="$t('common.healer')" />
    </v-bottom-navigation>
  </client-only>
</template>
