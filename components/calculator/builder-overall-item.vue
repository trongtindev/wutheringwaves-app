<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
}>();

// computed
const stats = computed(() => {
  const items = [
    {
      label: 'hp',
      value: 0,
    },
    {
      label: 'atk',
      value: 0,
    },
    {
      label: 'def',
      value: 0,
    },
    {
      label: 'critRate',
      value: 0,
    },
    {
      label: 'critDMG',
      value: 0,
    },
    {
      label: 'energyRegen',
      value: 0,
    },
    {
      label: 'resonanceSkillDMGBonus',
      value: 0,
    },
    {
      label: 'basicAttackDMGBonus',
      value: 0,
    },
    {
      label: 'heavyAttackDMGBonus',
      value: 0,
    },
    {
      label: 'resonanceLiberationDMGBonus',
      value: 0,
    },
    {
      label: 'physicalDMGBonus',
      value: 0,
    },
    {
      label: 'glacioDMGBonus',
      value: 0,
    },
    {
      label: 'fusionDMGBonus',
      value: 0,
    },
    {
      label: 'electroDMGBonus',
      value: 0,
    },
    {
      label: 'aeroDMGBonus',
      value: 0,
    },
    {
      label: 'spectroDMGBonus',
      value: 0,
    },
    {
      label: 'havocDMGBonus',
      value: 0,
    },
    {
      label: 'healingBonus',
      value: 0,
    },
  ];

  return items;
});
</script>

<template>
  <div>
    <!-- stats -->
    <v-table class="border rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            {{ $t('common.stats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(element, j) in stats" :key="j">
          <td class="w-70">
            {{ $t(`common.${element.label}`) }}
          </td>
          <td>
            {{ element.value }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
