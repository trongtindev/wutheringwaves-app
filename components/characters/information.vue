<script setup lang="ts">
import { mdiStar } from '@mdi/js';
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const format = formatNumber;

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

const stats = computed(() => {
  if (!props.data.stats) return [];

  return [
    {
      label: 'atk',
      value: props.data.stats.atk,
    },
    {
      label: 'def',
      value: props.data.stats.def,
    },
    {
      label: 'hp',
      value: props.data.stats.hp,
    },
    {
      label: 'critRate',
      value: 5,
    },
    {
      label: 'critDMG',
      value: 150,
    },
  ];
});
</script>

<template>
  <div>
    <v-table class="border rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            {{ $t('characters.information') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- rarity -->
        <tr class="rarity">
          <td class="w-50 text-center">
            {{ $t('common.rarity') }}
          </td>
          <td class="w-50 text-center">
            {{ item.rarity || '?' }}
            <v-icon :icon="mdiStar" />
          </td>
        </tr>

        <!-- attribute -->
        <tr class="attribute">
          <td class="w-50 text-center">
            {{ $t('common.attribute') }}
          </td>
          <td class="w-50 text-center">
            <span v-if="item.attribute">
              <img :src="item.attribute.icon" :width="16" />
              {{ item.attribute.name }}
            </span>
            <span v-else>
              {{ $t('common.none') }}
            </span>
          </td>
        </tr>

        <!-- weapon -->
        <tr class="weapon">
          <td class="w-50 text-center">
            {{ $t('common.weapon') }}
          </td>
          <td class="w-50 text-center">
            <span v-if="item.weapon">
              {{ item.weapon }}
            </span>
            <span v-else>
              {{ $t('common.none') }}
            </span>
          </td>
        </tr>

        <!-- birthday -->
        <tr class="birthday">
          <td class="w-50 text-center">
            {{ $t('common.birthday') }}
          </td>
          <td class="w-50 text-center">
            <span v-if="data.birthday">
              {{ data.birthday }}
            </span>
            <span v-else>
              {{ $t('common.none') }}
            </span>
          </td>
        </tr>

        <!-- birthplace -->
        <tr class="birthplace">
          <td class="w-50 text-center">
            {{ $t('common.birthplace') }}
          </td>
          <td class="w-50 text-center">
            <span v-if="data.birthplace">
              {{ data.birthplace }}
            </span>
            <span v-else>
              {{ $t('common.none') }}
            </span>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-table class="border rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            {{ $t('characters.stats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(element, index) in stats" :key="index">
          <td class="w-50 text-center">
            {{ $t(`common.${element.label}`) }}
          </td>
          <td class="w-50 text-center">
            {{ format(element.value) }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
