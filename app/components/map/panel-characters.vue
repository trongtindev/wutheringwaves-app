<script setup lang="ts">
import { mdiCheckCircle } from '@mdi/js';
import type { ICharacter } from '~/interfaces/character';
import type { IItem } from '~/interfaces/item';

// define
const emits = defineEmits<{
  (e: 'on-markers', markers: string[]);
}>();

// uses
const resource = useResources();

// states
const data = ref<
  {
    character: ICharacter;
    material?: IItem;
  }[]
>([]);
const selected = ref<string[]>([]);

// functions
const initialize = async () => {
  const items = await resource.getItems({ category: 'Resources' });
  const itemsDict: { [key: string]: IItem } = {};
  const characters = await resource.getCharacters({
    hidden: false,
    upcoming: false,
  });

  data.value = await Promise.all(
    characters.map(async (character) => {
      const data = await resource.getCharacterData(character.slug);
      const materials = (data.ascensions || [])
        .splice(1, 1)
        .flatMap((e) => {
          return e.cost;
        })
        .filter((e) => {
          const item = items.find((item) => {
            return (
              item.id === e.item || item.slug === e.item || item.name === e.item
            );
          });
          if (item) itemsDict[e.item] = item;
          return typeof item !== 'undefined';
        })
        .map((e) => {
          return { item: itemsDict[e.item] };
        });

      return {
        character: character,
        material: materials.length > 0 ? materials[0].item : undefined,
      };
    }),
  );
};

// events
const onPressed = (index: number) => {
  const item = data.value[index];
  const position = selected.value.findIndex((e) => e === item.character.name);

  if (position >= 0) {
    selected.value.splice(position, 1);
  } else {
    selected.value.push(item.character.name);
  }

  const markers = selected.value
    .map((name) => {
      return data.value.find((e) => e.character.name === name);
    })
    .map((e) => e!.material!.slug);
  emits('on-markers', markers);
};

// lifecycle
onMounted(() => initialize());
</script>

<template>
  <v-row>
    <v-col v-for="(element, index) in data" :key="index" cols="4" md="3">
      <v-card
        :disabled="!element.material"
        :color="
          selected.includes(element.character.name) ? 'primary' : undefined
        "
        @click="() => onPressed(index)"
      >
        <!-- icon -->
        <v-img
          :src="`/characters/icons/${element.character.slug}.webp`"
          :aspect-ratio="1"
          :class="`bg-rarity${element.character.rarity}`"
          class="rounded"
        />

        <!-- title -->
        <v-card-title class="text-caption pa-0 text-center">
          {{ element.character.name }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>
