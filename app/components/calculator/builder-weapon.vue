<script setup lang="ts">
const props = defineProps<{
  lite?: boolean;
}>();

// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const weapons = await resource.getWeapons({ upcoming: false });
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('common.weapon') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div v-if="props.lite">
      <calculator-builder-weapon-item
        :index="calculator.participant"
        :item="calculator.participants[calculator.participant]"
        :weapons
      />
    </div>
    <div v-else>
      <v-row class="ga-4">
        <v-col v-for="(item, index) in calculator.participants" :key="index">
          <calculator-builder-weapon-item :index :item :weapons />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
