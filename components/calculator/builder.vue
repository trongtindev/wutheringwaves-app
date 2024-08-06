<script setup lang="ts"></script>

<template>
  <client-only>
    <!-- disclaimer -->
    <base-alert :text="$t('calculator.builder.disclaimer')" color="warning" />

    <!-- teams -->
    <calculator-builder-team />

    <!-- sequences -->
    <calculator-builder-sequences />

    <!-- weapons -->
    <calculator-builder-weapon />

    <!-- echoes -->
    <calculator-builder-echoes />

    <!-- rotation -->
    <calculator-builder-rotation />

    <v-bottom-navigation class="border-t hidden-md-and-up">
      <v-btn :text="$t('common.mainDPS')" />
      <v-btn :text="$t('common.subDPS')" />
      <v-btn :text="$t('common.healer')" />
    </v-bottom-navigation>
  </client-only>
</template>
