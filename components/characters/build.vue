<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  echoes: IEcho[];
  weapons: IWeapon[];
}>();

// uses
const localePath = useLocalePath();

// computed
const nameLocalized = computed(() => {
  return props.item.name;
});

const skillPriority = computed(() => {
  if (!props.data.skillPriority) return [];
  return props.data.skillPriority;
});

const bestWeapons = computed(() => {
  if (!props.data.bestWeapons) return [];
  return props.data.bestWeapons.map((e) => {
    return {
      item: props.weapons.find((weapon) => weapon.slug == e.item)!,
      rank: e.rank,
      different: e.different,
    };
  });
});

const bestEchoSets = computed(() => {
  if (!props.data.bestEchoSets) return [];
  return props.data.bestEchoSets;
});

const bestMainEchoes = computed(() => {
  if (!props.data.bestMainEchoes) return [];
  return props.data.bestMainEchoes.map((e) => {
    return props.echoes.find((echo) => echo.slug == e)!;
  });
});

const bestEchoStats = computed(() => {
  if (!props.data.bestEchoStats) return [];
  return props.data.bestEchoStats;
});
</script>

<template>
  <div>
    <!-- Best Echo Sets -->
    <v-card v-if="props.data.skillPriority" class="mt-2">
      <v-card-title tag="h2">
        {{ $t('characters.skillPriority', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <v-col v-for="(element, index) in skillPriority" :key="index">
            <v-card class="rounded border fill-height">
              <v-card-text
                class="d-flex align-center justify-center w-100 h-100 text-center"
              >
                {{ element }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Best Weapons -->
    <v-card v-if="props.data.bestWeapons" class="mt-2">
      <v-card-title tag="h2">
        {{ $t('characters.bestWeapons', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-0 pt-2 pb-2">
        <v-row>
          <v-col
            v-for="(element, index) in bestWeapons"
            :key="index"
            cols="12"
            md="6"
          >
            <v-list-item :to="localePath(`/weapons/${element.item.slug}`)">
              <template #prepend>
                <v-avatar
                  :class="`border-rarity${element.item.rarity}`"
                  :image="`/weapons/icons/${element.item.slug}.webp`"
                  class="border"
                  rounded
                />
              </template>
              <v-list-item-title :class="`text-rarity${element.item.rarity}`">
                {{ element.item.name }} (S{{ element.rank }})
              </v-list-item-title>

              <template #append>
                <v-chip
                  :color="element.different >= 100 ? 'success' : undefined"
                >
                  {{ element.different }}%
                </v-chip>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Best Echo Sets -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('characters.bestEchoSets', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text v-if="props.data.bestEchoSets" class="pa-0 pt-2 pb-2">
        <v-row v-for="(element, index) in bestEchoSets" :key="index">
          <v-col v-for="(subElement, j) in element.items" :key="j">
            <v-list-item>
              <template #prepend>
                <v-avatar class="border" rounded />
              </template>

              <v-list-item-title>
                {{ subElement }}
              </v-list-item-title>

              <template #append>
                <v-chip
                  :color="element.different >= 100 ? 'success' : undefined"
                >
                  {{ element.different }}%
                </v-chip>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else>
        {{ $t('common.upcoming') }}
      </v-card-text>
    </v-card>

    <!-- Best Echo Stats -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('characters.bestEchoStats', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text v-if="props.data.bestEchoStats">
        <div
          v-for="(element, index) in bestEchoStats"
          :key="index"
          :class="{ 'mt-2': index > 0 }"
        >
          <v-row>
            <v-col v-for="(subElement, j) in element.items" :key="j">
              <v-card class="fill-height border">
                <v-card-title>
                  {{ subElement.cost }} {{ $t('common.cost') }}
                </v-card-title>
                <v-card-text>
                  {{ subElement.stats }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-card-text v-else>
        {{ $t('common.upcoming') }}
      </v-card-text>
    </v-card>

    <!-- Suggested Echos -->
    <v-card class="mt-2">
      <v-card-title tag="h2">
        {{ $t('characters.bestMainEchoes', { name: nameLocalized }) }}
      </v-card-title>
      <v-divider />

      <v-card-text v-if="props.data.bestMainEchoes">
        <v-row>
          <v-col
            v-for="(element, index) in bestMainEchoes"
            :key="index"
            cols="6"
            sm="4"
            md="2"
          >
            <echo-card :item="element" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else>
        {{ $t('common.upcoming') }}
      </v-card-text>
    </v-card>
  </div>
</template>
