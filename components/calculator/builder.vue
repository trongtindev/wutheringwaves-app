<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { mdiPlay } from '@mdi/js';

// uses
const { t } = useI18n();
const display = useDisplay();
const settings = useSettings();
const calculator = useCalculator();

// states
const isTours = ref(false);

// computed
const lite = computed(() => {
  return display.smAndDown.value;
});

const canStart = computed(() => {
  const addedCharacters = calculator.participants.filter((e) => e.character);
  if (addedCharacters.length <= 0) return false;

  const allCharacterFulfilled = addedCharacters.every((participant) => {
    return typeof participant.weapon !== 'undefined';
  });
  if (!allCharacterFulfilled) return false;

  // const addedEchoes = addedCharacters.filter((e) => e.echoes);

  return true;
});
</script>

<template>
  <div id="builder">
    <!-- disclaimer -->
    <base-alert :text="$t('calculator.builder.disclaimer')" color="warning" />

    <!-- teams -->
    <calculator-builder-team :lite />

    <!-- sequences -->
    <calculator-builder-sequences :lite />

    <!-- skills -->
    <calculator-builder-skills :lite />

    <!-- weapons -->
    <calculator-builder-weapon :lite />

    <!-- echoes -->
    <calculator-builder-echoes :lite />

    <!-- sonatas -->
    <calculator-builder-sonatas :lite />

    <!-- rotation -->
    <calculator-builder-rotation />

    <!-- overall -->
    <calculator-builder-overall :lite />

    <!-- bottom-navigation -->
    <v-bottom-navigation
      v-if="display.smAndDown.value"
      v-model="calculator.participant"
      class="border-t"
    >
      <v-btn :value="0" :text="$t('common.mainDPS')" />
      <v-btn :value="1" :text="$t('common.subDPS')" />
      <v-btn :value="2" :text="$t('common.healer')" />
    </v-bottom-navigation>

    <!-- reset -->
    <v-fab
      :text="$t('common.reset')"
      app
      location="bottom left"
      @click="() => calculator.reset()"
    />

    <!-- start -->
    <v-fab
      :prepend-icon="mdiPlay"
      :text="$t('calculator.builder.start')"
      :disabled="!canStart"
      color="primary"
      app
      @click="() => calculator.start()"
    />
  </div>
</template>
