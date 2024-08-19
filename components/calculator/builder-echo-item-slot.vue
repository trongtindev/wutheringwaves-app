<script setup lang="ts">
import type { ICalculatorEcho } from '~/interfaces/calculator';
import { mdiPencil } from '@mdi/js';

const props = defineProps<{
  participant: number;
  item: ICalculatorEcho;
  index: number;
}>();
const format = formatNumber;

// uses
const { t } = useI18n();
const calculator = useCalculator();

// states
const level = ref(props.item.level);
const rarity = ref(props.item.rarity);

// computed
const possibleMainstats = computed(() => {
  if (props.item.item) {
    const index = { 1: 0, 3: 1, 4: 2 };
    return echoMainStats[index[props.item.item.cost]].map((e) => {
      return {
        type: e[0],
        label: t(`common.${e[0].replace('%', '')}`),
        unit: e[0].includes('%') ? '%' : '',
        min: e[1],
        max: e[2],
      };
    });
  }
  return [];
});

const possibleSubstats = computed(() => {
  return echoSubStats.map((e) => {
    return {
      type: e[0],
      label: t(`common.${e[0].replace('%', '')}`),
      value: formatNumber(e[1]),
      unit: e[0].includes('%') ? '%' : '',
    };
  });
});

const substats = computed(() => {
  const samples: [string, number][] = Array.from(Array(5)).map(() => {
    return ['none', 0];
  });
  return (props.item.substats || samples).map((e) => {
    return {
      label: t(`common.${e[0].replace('%', '')}`),
      value: formatNumber(e[1]),
      unit: e[0].includes('%') ? '%' : '',
    };
  });
});

// functions
const loadStats = () => {
  level.value = props.item.level;
  rarity.value = props.item.rarity;
};

const setMainstats = (type: string | undefined) => {
  const stats = possibleMainstats.value.find((e) => e.type === type);
  if (stats) {
    const stepSize = (stats.max - stats.min) / 24;

    calculator.participants[props.participant].echoes[props.index].mainstats = [
      stats.type,
      stats.min + (level.value - 1) * stepSize,
    ];

    if (
      !calculator.participants[props.participant].echoes[props.index].substats
    ) {
      setRandomSubstats();
    }
  } else {
    calculator.participants[props.participant].echoes[props.index].mainstats =
      undefined;
  }
};

const setRandomMainstats = () => {
  const random = randomArray(possibleMainstats.value);
  setMainstats(random.type);
};

const setSubstats = (index: number, type: string) => {
  const stats = echoSubStats.find((e) => e[0] === type)!;
  if (!stats) throw new Error(`not found substats ${type}`);

  if (
    !calculator.participants[props.participant].echoes[props.index].substats
  ) {
    setRandomSubstats();
  }

  calculator.participants[props.participant].echoes[props.index].substats![
    index
  ] = [type, stats[2]];
};

const setMaxSubstats = () => {
  if (
    !calculator.participants[props.participant].echoes[props.index].substats
  ) {
    setRandomSubstats();
  }

  const newStats: [string, number][] = calculator.participants[
    props.participant
  ].echoes[props.index].substats!.map((stat) => {
    const stats = echoSubStats.find((e) => e[0] === stat[0])!;
    return [stat[0], stats[2]];
  });
  calculator.participants[props.participant].echoes[props.index].substats =
    newStats;
};

const setRandomSubstats = () => {
  const stats = randomUniqueArray(echoSubStats, 5);
  calculator.participants[props.participant].echoes[props.index].substats =
    stats.map((e) => {
      const [type, min, max] = e;
      return [type, randomRange(min, max)];
    });
};

// changes
watch(() => props.index, loadStats);

watch(level, (value) => {
  calculator.participants[props.participant].echoes[props.index].level = value;

  if (props.item.mainstats) {
    setMainstats(props.item.mainstats[0]);
  }
});

watch(rarity, (value) => {
  calculator.participants[props.participant].echoes[props.index].rarity = value;
});

watch(
  () => props.item.item,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      setRandomMainstats();
      setRandomSubstats();
    }
  },
);
</script>

<template>
  <div>
    <!-- level -->
    <v-slider
      v-model="level"
      :min="1"
      :max="25"
      :step="1"
      :label="$t('common.level')"
      :disabled="!item.item"
      thumb-label
      hide-details
    />

    <!-- rarity -->
    <v-slider
      v-model="rarity"
      :min="2"
      :max="5"
      :step="1"
      :label="$t('common.rarity')"
      :disabled="!item.item || true"
      thumb-label
      hide-details
    />

    <!-- main stats -->
    <v-table class="rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            <span v-if="item.item"> [{{ item.item.name }}] </span>
            <span v-else> [{{ $t('common.none') }}] </span>
            {{ $t('common.mainstats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="w-70">
            <v-menu>
              <template #activator="menu">
                <v-btn
                  v-bind="menu.props"
                  :text="
                    item.mainstats ? item.mainstats[0] : $t('common.select')
                  "
                  :prepend-icon="mdiPencil"
                  :disabled="!item.item"
                />
              </template>

              <v-list class="border rounded" :elevation="3" :max-height="256">
                <v-list-item
                  v-for="element in possibleMainstats"
                  :key="element.type"
                  :title="`${element.label} ${element.unit}`"
                  @click="() => setMainstats(element.type)"
                />
              </v-list>
            </v-menu>
          </td>
          <td>
            <span v-if="item.mainstats">
              {{ format(item.mainstats[1]) }}
            </span>
            <span v-else>
              {{ $t('common.none') }}
            </span>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- sub stats -->
    <v-table class="rounded mt-2">
      <thead>
        <tr>
          <th colspan="3" class="ma-2 text-center font-weight-bold">
            <span v-if="item.item"> [{{ item.item.name }}] </span>
            <span v-else> [{{ $t('common.none') }}] </span>
            {{ $t('common.substats') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(element, j) in substats" :key="j">
          <td class="w-70">
            <v-menu>
              <template #activator="menu">
                <v-btn
                  v-bind="menu.props"
                  :text="`${element.label} ${element.unit}`"
                  :prepend-icon="mdiPencil"
                />
              </template>

              <v-list class="border rounded" :elevation="3" :max-height="256">
                <v-list-item
                  v-for="stats in possibleSubstats"
                  :key="stats.type"
                  :title="`${stats.label} ${stats.unit}`"
                  @click="() => setSubstats(j, stats.type)"
                />
              </v-list>
            </v-menu>
          </td>
          <td>
            <v-text-field
              :model-value="element.value"
              :disabled="element.value == '0'"
              variant="plain"
              density="compact"
              hide-details
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- generate -->
    <div class="mt-2">
      <v-row>
        <v-col>
          <v-btn :text="$t('common.max')" block @click="setMaxSubstats" />
        </v-col>
        <v-col>
          <v-btn :text="$t('common.random')" block @click="setRandomSubstats" />
        </v-col>
      </v-row>
    </div>

    <!-- sonata effects -->
  </div>
</template>
