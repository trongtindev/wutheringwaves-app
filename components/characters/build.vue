<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IEcho } from '~/interfaces/echo';
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: ICharacter;
  nameLocalized: string;
  data: ICharacterData;
  echoes: IEcho[];
  weapons: IWeapon[];
}>();

// uses
const display = useDisplay();
const localePath = useLocalePath();
const skillDict = Object.fromEntries(
  (props.data.skills || []).map((e) => [e.type, e]),
);

// computed
const skillPriority = props.data.skillPriority || [];

const bestWeapons = (() => {
  if (!props.data.bestWeapons) return [];
  return props.data.bestWeapons.map((e) => {
    return {
      item: props.weapons.find((weapon) => weapon.slug == e.item)!,
      rank: e.rank,
      different: e.different,
    };
  });
})();

const bestEchoSets = props.data.bestEchoSets || [];

const bestMainEchoes = (() => {
  if (!props.data.bestMainEchoes) return [];
  return props.data.bestMainEchoes.map((e) => {
    return props.echoes.find((echo) => echo.slug == e)!;
  });
})();

const bestEchoStats = props.data.bestEchoStats || [];
</script>

<template>
  <div>
    <!-- skillPriority -->
    <section-title>
      <template #title>
        {{ $t('characters.skillPriority', { name: nameLocalized }) }}
      </template>

      <template #subtitle>
        {{ $t('characters.skillPriorityDescription', { name: nameLocalized }) }}
      </template>
    </section-title>

    <div class="mt-2">
      <div v-if="props.data.skillPriority">
        <v-row>
          <v-col
            v-for="(element, index) in skillPriority"
            :key="index"
            :cols="display.smAndDown.value ? 12 : undefined"
          >
            <v-card class="pt-1 pb-1">
              <v-list-item>
                <template #prepend>
                  <v-avatar class="rounded border">
                    <v-img>
                      <v-sheet
                        class="bg-info position-absolute bottom-0 right-0 pl-1 pr-1 rounded-ts"
                      >
                        {{ (index + 1).toString() }}
                      </v-sheet>
                    </v-img>
                  </v-avatar>
                </template>

                <v-list-item-title>
                  {{ element }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="skillDict[element]">
                  {{ skillDict[element].name }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-alert v-else :text="$t('common.upcoming')" />
    </div>

    <!-- Best Weapons -->
    <section-title>
      <template #title>
        {{ $t('characters.bestWeapons', { name: nameLocalized }) }}
      </template>
    </section-title>

    <div class="mt-2">
      <div v-if="props.data.bestWeapons">
        <v-card class="pt-2 pb-2">
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
        </v-card>
      </div>
      <v-alert v-else :text="$t('common.upcoming')" />
    </div>

    <!-- Best Echo Sets -->
    <div class="mt-2">
      <h2 class="text-h6 mb-2">
        {{ $t('characters.bestEchoSets', { name: nameLocalized }) }}
      </h2>

      <div v-if="props.data.bestEchoSets">
        <v-card class="pt-2 pb-2">
          <v-row v-for="(element, index) in bestEchoSets" :key="index">
            <v-col v-for="(subElement, j) in element.items" :key="j">
              <v-list-item>
                <template #prepend>
                  <v-avatar rounded>
                    <v-img
                      :src="subElement.icon"
                      :style="`background: ${subElement.colors.background}; border: 3px solid ${subElement.colors.border};`"
                    />
                  </v-avatar>
                </template>

                <v-list-item-title>
                  {{ subElement.name }}
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
        </v-card>
      </div>
      <v-alert v-else :text="$t('common.upcoming')" />
    </div>

    <!-- Best Echo Stats -->
    <div class="mt-2">
      <h2 class="text-h6 mb-2">
        {{ $t('characters.bestEchoStats', { name: nameLocalized }) }}
      </h2>

      <div v-if="props.data.bestEchoStats">
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
                <v-card-text class="d-flex ga-2">
                  <v-chip
                    v-for="(e, k) in subElement.stats"
                    :key="k"
                    :text="e"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-alert v-else :text="$t('common.upcoming')" />
    </div>

    <!-- Suggested Echos -->
    <div class="mt-2">
      <h2 class="text-h6 mb-2">
        {{ $t('characters.bestMainEchoes', { name: nameLocalized }) }}
      </h2>

      <div v-if="props.data.bestMainEchoes">
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
      </div>

      <v-alert v-else :text="$t('common.upcoming')" />
    </div>
  </div>
</template>
