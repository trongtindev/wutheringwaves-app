<script setup lang="ts">
import type { ICharacter, ICharacterData } from '~/interfaces/character';
import type { IWeapon } from '~/interfaces/weapon';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
  weapons: IWeapon[];
}>();

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

// uses
const localePath = useLocalePath();
</script>

<template>
  <characters-section :item>
    <template #title>
      {{ $t('characters.bestWeapons') }}
    </template>

    <div class="mt-2">
      <div v-if="props.data.bestWeapons">
        <v-row>
          <v-col
            v-for="(element, index) in bestWeapons"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card
              :to="localePath(`/weapons/${element.item.slug}`)"
              class="pt-2 pb-2"
            >
              <v-list-item>
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
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-alert v-else :text="$t('common.upcoming')" />
    </div>
  </characters-section>
</template>
