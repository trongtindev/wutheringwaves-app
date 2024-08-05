<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { ICharacter } from '~/interfaces/character';

const props = defineProps<{
  index: number;
  item: ICalculatorParticipant;
  characters: ICharacter[];
}>();

const format = formatNumber;

// uses
const { t } = useI18n();
const resource = useResources();
const calculator = useCalculator();

// states
const level = ref(props.item.level);
const character = ref(props.item.character ? props.item.character.item : null);

// computed
const role = computed(() => {
  if (props.index === 0) {
    return {
      text: t('common.mainDPS'),
      color: 'error',
    };
  } else if (props.index === 1) {
    return {
      text: t('common.subDPS'),
      color: 'warning',
    };
  }
  return { text: t('common.healer'), color: 'success' };
});

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
  () => character.value,
  async (value) => {
    if (!value) {
      calculator.participants[props.index].character = undefined;
      return;
    }

    const data = await resource.getCharacterData(value?.slug);
    calculator.participants[props.index].character = {
      item: value,
      data,
    };
  },
);

watch(
  () => level.value,
  (value) => {
    calculator.participants[props.index].level = value;
  },
);
</script>

<template>
  <div>
    <div class="d-flex justify-center">
      <v-sheet
        :width="96"
        :height="96"
        class="border rounded-circle d-flex justify-center align-center"
      >
        <v-badge location="bottom" :color="role.color" :content="role.text">
          <v-avatar
            v-if="item.character"
            :image="item.character.item.images.icon"
            :size="96"
          />
          <v-avatar v-else :size="96"> ? </v-avatar>
        </v-badge>
      </v-sheet>
    </div>

    <v-autocomplete
      v-model="character"
      :items="characters"
      :item-title="(e) => e.name"
      :return-object="true"
      :clearable="true"
      hide-details
      class="mt-4 mb-2"
    >
      <template #item="{ item, props }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-avatar :image="item.raw.images.icon" />
          </template>

          <template #append>
            <v-avatar :size="24" :image="item.raw.attribute.icon" />
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>

    <v-slider
      v-model="level"
      :step="1"
      :min="1"
      :max="90"
      :label="$t('common.level')"
      :disabled="!item.character"
      thumb-label
      hide-details
    />

    <!-- stats -->
    <v-table class="border rounded mt-2">
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
    </v-table>
  </div>
</template>
