<script setup lang="ts">
import type { IMarker } from '~/interfaces/map';
import { mdiCheckboxMarked, mdiCheckboxBlank } from '@mdi/js';

// define
const emits = defineEmits<{
  (e: 'onActiveChanged', value: { [key: string]: boolean });
}>();

const props = defineProps<{
  markers: IMarker[];
}>();

// uses
const i18n = useI18n();

// states
const active = ref({
  z1: true,
  z2: true,
  z13: true,
});
const groups = ref([
  {
    name: 'featured',
    items: [
      'z1',
      'z2',
      'z7',
      'z3',
      'z4',
      'z6',
      'z10',
      'z11',
      'z12',
      'z13',
      'z14',
    ],
  },
  {
    name: 'battle',
    items: ['z251', 'z8', 'z9'],
  },
  {
    name: 'material',
    items: [
      'z101',
      'z102',
      'z103',
      'z104',
      'z105',
      'z106',
      'z107',
      'z108',
      'z162',
      'z163',
    ],
  },
  {
    name: 'ore',
    items: ['z401', 'z402', 'z403', 'z404', 'z405'],
  },
  {
    name: 'echoes',
    items: Array.from(Array(54).keys())
      .map((e) => {
        return `z${e + 201}`;
      })
      .filter((e) => {
        return ![
          'z222',
          'z232',
          'z237',
          'z239',
          'z242',
          'z243',
          'z244',
          'z245',
          'z248',
          'z251',
        ].includes(e);
      }),
  },
  {
    name: 'others',
    items: null,
  },
]);
const items = ref<{ [key: string]: IMarker[] }>();
const count = ref({});

// computed
const nameLocalized = computed(() => {
  // TODO: use i18n here
  return mapIconNamedDict;
});

// events
const onPressedToggle = (type: string) => {
  if (active.value[type]) {
    delete active.value[type];
  } else {
    active.value[type] = true;
  }
  emits('onActiveChanged', active.value);
};

const onPressedCheckAll = (types: string[] | null) => {
  types ??= [];

  for (const type of types) {
    active.value[type] = true;
  }
  emits('onActiveChanged', active.value);
};

const onPressedUncheckAll = (types: string[] | null) => {
  types ??= [];

  for (const type of types) {
    delete active.value[type];
  }
  emits('onActiveChanged', active.value);
};

// lifecycle
onMounted(() => {
  // reset
  items.value = {};

  // const excludes: string[] = [];
  for (const group of groups.value) {
    items.value[group.name] ??= [];

    if (group.items) {
      // group.items.forEach((e) => excludes.push(e));
      items.value[group.name] = props.markers.filter((e) => {
        return group.items.includes(e.type);
      });
    }
  }

  for (const group of groups.value) {
    if (group.items) {
      for (const item of group.items) {
        count.value[item] = props.markers.filter((e) => {
          return e.type === item;
        }).length;
      }
    }
  }

  emits('onActiveChanged', active.value);
});
</script>

<template>
  <div>
    <div v-if="!props.markers" class="text-center">
      <v-progress-circular :indeterminate="true" />
    </div>

    <div v-else>
      <v-sheet v-for="(group, index) in groups" :key="index">
        <v-row>
          <v-col class="d-flex align-center">
            {{ $t(group.name) }}
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <v-btn
              size="small"
              variant="text"
              color="white"
              @click="() => onPressedCheckAll(group.items)"
            >
              <v-icon :icon="mdiCheckboxMarked" />
              <span class="ml-1 hidden-sm-and-down">
                {{ $t('common.checkAll') }}
              </span>
            </v-btn>

            <v-btn
              size="small"
              variant="text"
              color="white"
              @click="() => onPressedUncheckAll(group.items)"
            >
              <v-icon :icon="mdiCheckboxBlank" />
              <span class="ml-1 hidden-sm-and-down">
                {{ $t('common.clear') }}
              </span>
            </v-btn>
          </v-col>
        </v-row>

        <v-sheet v-if="items" class="mt-2">
          <v-row>
            <v-col v-for="(item, j) in group.items" :key="j" cols="12" md="6">
              <v-card @click="() => onPressedToggle(item)">
                <v-list-item
                  :title="nameLocalized[item] || item"
                  :active="active[item]"
                >
                  <!-- :src="`/map/icons/${category.slug}.webp`" -->
                  <template #prepend>
                    <v-img
                      style="margin-left: -7.5px"
                      class="mr-1"
                      :src="`/map/icons/${item}.webp`"
                      :width="28"
                      :height="28"
                    />
                  </template>

                  <template #append>
                    {{ count[item] || 0 }}
                  </template>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-sheet>
    </div>
  </div>
</template>
