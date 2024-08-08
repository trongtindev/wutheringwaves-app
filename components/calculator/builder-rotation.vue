<script setup lang="ts">
import { mdiPlus, mdiArrowUp, mdiArrowDown, mdiMinus } from '@mdi/js';
import type { ICharacter, ICharacterSkillData } from '~/interfaces/character';

// uses
const resource = useResources();
const calculator = useCalculator();

// fetch
const characters = await resource.getCharacters();
const characterDict = arrayToObject(characters, (e) => e.slug);

// computed
const possibleCharacters = computed(() => {
  return calculator.participants
    .filter((e) => e.character)
    .map((e) => e.character!);
});

// events
const onAddRotation = (character: ICharacter, skill: ICharacterSkillData) => {
  calculator.rotations.push([character.slug, skill]);
};

const onPressedRemove = (index: number) => {
  calculator.rotations.splice(index, 1);
};

const onPressedUp = (index: number) => {};

const onPressedDown = (index: number) => {};
</script>

<template>
  <div class="mb-4">
    <div class="mb-2">
      <v-row class="ga-4">
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
        <v-col class="text-h6 text-center">
          {{ $t('calculator.builder.rotation.title') }}
        </v-col>
        <v-col class="d-flex align-center">
          <v-divider />
        </v-col>
      </v-row>
    </div>

    <div>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <div>
            <v-skeleton-loader
              v-if="calculator.rotations.length == 0"
              boilerplate
              type="list-item-avatar-two-line"
              class="mb-2"
            />

            <v-list v-else class="mb-2 rounded">
              <v-list-item
                v-for="([character, skill], index) in calculator.rotations"
                :key="index"
                :title="characterDict[character].name"
                :subtitle="skill.type"
              >
                <template #prepend>
                  <v-avatar
                    v-if="characterDict[character]"
                    :image="characterDict[character].images.icon"
                    class="border"
                    rounded
                  />
                </template>

                <template #append>
                  <div class="d-flex ga-2">
                    <v-btn
                      :icon="mdiMinus"
                      size="small"
                      @click="() => onPressedRemove(index)"
                    />
                    <v-divider vertical />
                    <v-btn
                      :icon="mdiArrowUp"
                      :disabled="index == 0"
                      variant="text"
                      size="small"
                      @click="() => onPressedUp(index)"
                    />
                    <v-btn
                      :icon="mdiArrowDown"
                      :disabled="index >= calculator.rotations.length - 1"
                      size="small"
                      variant="text"
                      @click="() => onPressedDown(index)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <v-menu>
            <template #activator="menu">
              <v-btn
                v-bind="menu.props"
                :text="$t('calculator.builder.rotation.add')"
                :append-icon="mdiPlus"
                block
              />
            </template>

            <v-list :max-height="512">
              <v-list-group
                v-for="(character, index) in possibleCharacters"
                :key="index"
                fluid
              >
                <template #activator="group">
                  <v-list-item
                    v-bind="group.props"
                    :title="character.item.name"
                    :prepend-avatar="character.item.images.icon"
                  />
                </template>

                <calculator-builder-rotation-skills
                  :skills="character.data.skills || []"
                  @on-click="(val) => onAddRotation(character.item, val)"
                />
              </v-list-group>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
