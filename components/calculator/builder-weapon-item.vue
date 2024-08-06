<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { IWeapon, IWeaponDataStats } from '~/interfaces/weapon';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
  weapons: IWeapon[];
}>();

// uses
const { t } = useI18n();
const resource = useResources();
const calculator = useCalculator();

// states
const level = ref(props.item.weaponLevel);
const rank = ref(props.item.weaponRank);
const weapon = ref(props.item.weapon ? props.item.weapon.item : undefined);
const previewStats = ref<IWeaponDataStats>();

// functions
const initialize = () => {
  updateStats();
};

const updateStats = () => {
  if (!props.item.weapon) {
    previewStats.value = undefined;
    return;
  }

  if (!props.item.weapon.data) {
    previewStats.value = undefined;
    return;
  }

  previewStats.value = getWeaponStats(
    level.value,
    props.item.weapon.data.stats,
  );
};

// computed
const stats = computed(() => {
  const items = [
    {
      label: 'atk',
      value: previewStats.value ? formatNumber(previewStats.value.atkFlat) : 0,
    },
  ];

  if (previewStats.value) {
    if (previewStats.value.atk) {
      items.push({
        label: 'atk',
        value: `${previewStats.value.atk}%`,
      });
    }

    if (previewStats.value.def) {
      items.push({
        label: 'def',
        value: `${previewStats.value.def}%`,
      });
    }

    if (previewStats.value.critRate) {
      items.push({
        label: 'critRate',
        value: `${previewStats.value.critRate}%`,
      });
    }

    if (previewStats.value.critDMG) {
      items.push({
        label: 'critDMG',
        value: `${previewStats.value.critDMG}%`,
      });
    }

    if (previewStats.value.energyRegen) {
      items.push({
        label: 'energyRegen',
        value: `${previewStats.value.energyRegen}%`,
      });
    }
  }
  return items;
});

const filterWeapons = computed(() => {
  if (props.item.character) {
    const weapon = props.item.character.item.weapon;
    return props.weapons.filter((e) => e.type === weapon);
  }
  return [];
});

const description = computed(() => {
  if (!props.item.weapon) return null;
  if (!props.item.weapon.data.skill) return null;

  const params = props.item.weapon.data.skill.params;
  return props.item.weapon.data.skill.description
    .replace(/\{(\d+)\}/g, (_, j) => params[rank.value - 1][j] || '')
    .replaceAll('\n', '<br/>');
});

// changes
watch(
  () => weapon.value,
  async (value) => {
    if (!value) {
      calculator.participants[props.index].weapon = undefined;
      return;
    }

    const data = await resource.getWeaponData(value?.slug);
    calculator.participants[props.index].weapon = {
      item: value,
      data,
    };

    updateStats();
  },
);

watch(
  () => level.value,
  (value) => {
    calculator.participants[props.index].weaponLevel = value;
    updateStats();
  },
);

watch(
  () => props.item.character,
  () => {
    if (props.item.character && weapon.value) {
      if (props.item.character.item.weapon === weapon.value.type) {
        return;
      }
    }
    weapon.value = undefined;
  },
);

// lifecycle
onMounted(initialize);
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
      :items="filterWeapons"
      :item-title="(e) => e.name"
      :return-object="true"
      :clearable="true"
      :placeholder="$t('common.selectWeapon')"
      :disabled="!item.character"
      hide-details
      class="mt-4 mb-2"
    >
      <template #item="{ item: element, props: _props }">
        <v-list-item v-bind="_props">
          <template #prepend>
            <v-avatar
              :image="element.raw.icon"
              :class="`bg-rarity${element.raw.rarity}`"
            />
          </template>

          <template #append>
            {{ element.raw.type }}
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>

    <!-- level -->
    <v-slider
      v-model="level"
      :step="1"
      :min="1"
      :max="90"
      :label="$t('common.level')"
      :disabled="!item.weapon"
      thumb-label
      hide-details
    >
      <template #label>
        <div style="width: 100px">
          {{ $t('common.level') }}
        </div>
      </template>
    </v-slider>

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
          <td class="w-50 text-center">
            {{ $t(`common.${element.label}`) }}
          </td>
          <td class="w-50 text-center">
            {{ element.value }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- rank -->
    <v-slider
      v-model="rank"
      :step="1"
      :min="1"
      :max="5"
      :disabled="!item.weapon"
      thumb-label
      hide-details
      class="mt-2"
    >
      <template #label>
        <div style="width: 100px">
          {{ $t('common.rank') }}
        </div>
      </template>
    </v-slider>

    <!-- description -->
    <v-card v-if="description" class="mt-2">
      <v-card-text>
        <div :innerHTML="description" />
      </v-card-text>
    </v-card>
  </div>
</template>
