<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
  weapons: IWeapon[];
}>();

const format = formatNumber;

// uses
const { t } = useI18n();
const resource = useResources();
const calculator = useCalculator();

// states
const level = ref(props.item.level);
const weapon = ref(props.item.weapon ? props.item.weapon.item : null);

// computed
const stats = computed(() => {
  const data = props.item.character?.data.stats;
  return [
    {
      label: 'atk',
      value: data ? data.atk : 0,
    },
    {
      label: 'def',
      value: data ? data.def : 0,
    },
    {
      label: 'hp',
      value: data ? data.hp : 0,
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

// changes
watch(
  () => weapon.value,
  async (value) => {
    if (!value) {
      calculator.participants[props.index].character = undefined;
      return;
    }

    const data = await resource.getWeaponData(value?.slug);
    calculator.participants[props.index].weapon = {
      item: value,
      data,
    };
  },
);

// watch(
//   () => level.value,
//   (value) => {
//     calculator.participants[props.index].level = value;
//   },
// );
</script>

<template>
  <div>
    <div class="d-flex justify-center">
      <v-sheet
        :width="96"
        :height="96"
        class="border rounded-circle d-flex justify-center align-center"
      >
        <v-avatar
          v-if="item.weapon"
          :size="96"
          :image="item.weapon.item.icon"
          :class="`bg-rarity${item.weapon.item.rarity}`"
        />
        <v-avatar v-else :size="96"> ? </v-avatar>
      </v-sheet>
    </div>

    <v-autocomplete
      v-model="weapon"
      :items="weapons"
      :item-title="(e) => e.name"
      :return-object="true"
      :clearable="true"
      hide-details
      class="mt-4 mb-2"
    >
      <template #item="{ item, props }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-avatar
              :image="item.raw.icon"
              :class="`bg-rarity${item.raw.rarity}`"
            />
          </template>

          <template #append>
            {{ item.raw.type }}
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>

    <!-- <v-slider
      v-model="level"
      :step="1"
      :min="1"
      :max="90"
      :label="$t('common.level')"
      :disabled="!item.character"
      thumb-label
      hide-details
    /> -->

    <!-- stats -->
    <!-- <v-table class="border rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            {{ $t('characters.stats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(element, j) in stats" :key="j">
          <td class="w-50 text-center">
            {{ $t(`common.${element.label}`) }}
          </td>
          <td class="w-50 text-center">
            {{ format(element.value) }}
          </td>
        </tr>
      </tbody>
    </v-table> -->
  </div>
</template>
