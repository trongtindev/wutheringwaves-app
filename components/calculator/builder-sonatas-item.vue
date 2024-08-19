<script setup lang="ts">
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { ISonata } from '~/interfaces/sonata';
import { mdiPlus, mdiMinus } from '@mdi/js';

const props = defineProps<{
  participant: number;
  item: ICalculatorParticipant;
  sonatas: ISonata[];
}>();

// uses
const calculator = useCalculator();

// states
const activeSonatas = computed(() => {
  const sonatas = props.item.sonatas;
  return Object.fromEntries(sonatas.map((e) => [e.slug, e]));
});
const possibleSonatas = ref<ISonata[]>([]);

// computed
const total = computed(() => {
  return props.item.sonatas.length;
});

// functions
const updatePossibleSonatas = () => {
  const items = props.item.echoes
    .filter((e) => e.item)
    .flatMap((e) => e.item!.sonataEffects);
  const sonatas: ISonata[] = [];

  items.forEach((sonata) => {
    if (sonatas.find((e) => e.slug === sonata.slug)) {
      return;
    }
    sonatas.push(sonata);
  });

  possibleSonatas.value = sonatas;
};

// events
const onPressedRemove = (index: number) => {
  calculator.participants[props.participant].sonatas.splice(index, 1);
};

const onPressedAdd = (sonata: ISonata) => {
  calculator.participants[props.participant].sonatas.push(sonata);
};

// changes
watch(() => props.participant, updatePossibleSonatas);
watch(() => props.item._echoes, updatePossibleSonatas);

// lifecycle
onMounted(updatePossibleSonatas);
</script>

<template>
  <div>
    <v-list class="rounded mb-2">
      <v-list-subheader>
        {{ $t('calculator.builder.sonatas.activeSonatas') }} ({{
          item.sonatas.length
        }})
      </v-list-subheader>

      <v-list-item v-for="(sonata, index) in item.sonatas" :key="index">
        <template #prepend>
          <v-avatar class="border" rounded>
            <v-img
              :src="sonata.icon"
              :style="`background: ${sonata.colors.background}; border: 3px solid ${sonata.colors.border};`"
            />
          </v-avatar>
        </template>

        <v-list-item-title>
          {{ sonata.name }}
        </v-list-item-title>

        <template #append>
          <v-btn
            :text="$t('common.remove')"
            :append-icon="mdiMinus"
            size="small"
            variant="tonal"
            @click="() => onPressedRemove(index)"
          />
        </template>
      </v-list-item>
    </v-list>

    <base-alert
      v-if="possibleSonatas.length === 0"
      :text="$t('calculator.builder.sonatas.empty')"
      color="warning"
    />
    <v-list v-else class="rounded">
      <v-list-subheader>
        {{ $t('calculator.builder.sonatas.possibleSonatas') }} ({{
          possibleSonatas.length
        }})
      </v-list-subheader>

      <v-list-item v-for="(sonata, index) in possibleSonatas" :key="index">
        <template #prepend>
          <v-avatar class="border" rounded>
            <v-img
              :src="sonata.icon"
              :style="`background: ${sonata.colors.background}; border: 3px solid ${sonata.colors.border};`"
            />
          </v-avatar>
        </template>

        <v-list-item-title>
          {{ sonata.name }}
        </v-list-item-title>

        <template #append>
          <v-btn
            :text="$t('common.add')"
            :append-icon="mdiPlus"
            :disabled="total >= 2"
            size="small"
            variant="tonal"
            @click="() => onPressedAdd(sonata)"
          />
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
