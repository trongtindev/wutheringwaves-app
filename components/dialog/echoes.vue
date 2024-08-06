<script setup lang="ts">
import type { IEcho } from '~/interfaces/echo';
import { mdiCheck } from '@mdi/js';
import type { ISonata } from '~/interfaces/sonata';

const emits = defineEmits<{
  (e: 'on-close');
  (e: 'on-select', value: IEcho);
}>();

// uses
const resources = useResources();

// states
const echoes = ref<IEcho[]>([]);
const sonataEffects = ref<ISonata[]>([]);
const filterCost = useLocalStorage('filterCost', 0);
const filterSonata = useLocalStorage<string | undefined>(
  'filterSonata',
  undefined,
);

// functions
const initialize = async () => {
  echoes.value = await resources.getEchoes();
  sonataEffects.value = await resources.getSonataEffects();
};

// computed
const filterEchoes = computed(() => {
  return echoes.value.filter((e) => {
    if (filterCost.value > 0 && e.cost !== filterCost.value) {
      return false;
    }
    if (filterSonata.value) {
      if (!e.sonataEffects.map((e) => e.slug).includes(filterSonata.value)) {
        return false;
      }
    }
    return true;
  });
});

// lifecycle
onMounted(initialize);
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('dialog.echoes.title') }}
    </v-card-title>

    <v-card-item class="pa-2">
      <div class="d-flex flex-wrap ga-2 justify-center">
        <v-chip
          v-for="cost in [0, 4, 3, 1]"
          :text="cost === 0 ? $t('common.all') : `${$t('common.cost')} ${cost}`"
          :prepend-icon="filterCost === cost ? mdiCheck : undefined"
          @click="() => (filterCost = cost)"
        />
      </div>

      <div class="d-flex flex-wrap ga-2 justify-center mt-2">
        <v-chip
          :text="$t('common.all')"
          :prepend-icon="!filterSonata ? mdiCheck : undefined"
          @click="() => (filterSonata = undefined)"
        />

        <v-chip
          v-for="sonata in sonataEffects"
          :text="sonata.name"
          :prepend-icon="
            filterSonata && filterSonata === sonata?.slug ? mdiCheck : undefined
          "
          :prepend-avatar="sonata.icon"
          :style="`color: ${sonata.colors.border};`"
          @click="() => (filterSonata = sonata.slug)"
        />
      </div>
    </v-card-item>

    <v-divider v-if="filterEchoes.length > 0" />
    <v-list v-if="filterEchoes.length > 0">
      <v-list-item
        v-for="(item, index) in filterEchoes"
        :key="index"
        cols="6"
        md="3"
        lg="2"
        @click="() => emits('on-select', item)"
      >
        <template #prepend>
          <v-avatar :image="item.icon" class="border" rounded />
        </template>

        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>

        <v-list-item-subtitle class="d-flex ga-2">
          <v-chip :text="`${$t('common.cost')} ${item.cost}`" />
          <v-chip
            v-for="sonata in item.sonataEffects"
            :key="sonata.slug"
            :text="sonata.name"
            :prepend-avatar="sonata.icon"
            :style="`color: ${sonata.colors.border};`"
          />
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
