<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ICharacter, ICharacterData } from '~/interfaces/character';

const props = defineProps<{
  item: ICharacter;
  data: ICharacterData;
}>();

const skillDict = Object.fromEntries(
  (props.data.skills || []).map((e) => [e.type, e]),
);
const skillPriority = props.data.skillPriority || [];

// uses
const display = useDisplay();
</script>

<template>
  <div>
    <!-- skillPriority -->
    <!-- <section-title>
      <template #title>
        {{ $t('characters.skillPriority', { name: nameLocalized }) }}
      </template>

      <template #subtitle>
        {{ $t('characters.skillPriorityDescription', { name: nameLocalized }) }}
      </template>
    </section-title> -->

    <!-- <v-row :no-gutters="true" class="border-b mb-2">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <v-sheet
          :width="18"
          :height="18"
          class="rounded mr-2"
          :class="`bg-${item.attribute.slug}`"
        />
        <h2 class="text-h6">
          {{ $t('characters.skills') }}
        </h2>
      </v-col>
    </v-row> -->

    <characters-section :item>
      <template #title>
        {{ $t('characters.skillPriority') }}
      </template>

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
                        class="position-absolute bottom-0 right-0 pl-1 pr-1 rounded-ts text-body-2"
                        :class="`bg-${item.attribute.slug}`"
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
    </characters-section>
  </div>
</template>
