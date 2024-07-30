<script setup lang="ts">
const CARDS = Array.from(Array(25).keys())
  .filter((e) => e !== 3)
  .map((i) => {
    return {
      id: i + 1
    };
  });

// define
type GalleryType =
  | 'cards'
  | 'character-avatars'
  | 'character-icons'
  | 'character-portraits'
  | 'character-splash-art'
  | 'echo-icons'
  | 'weapon-icons'
  | 'item-icons'
  | 'emotes';
const emits = defineEmits<{
  (e: 'on-close');
  (e: 'on-selected', url: string);
}>();

const props = defineProps<{
  type: GalleryType | GalleryType[];
}>();
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('dialog.gallery.title') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="(element, index) in CARDS"
          :key="index"
          cols="6"
          md="4"
          lg="3"
        >
          <v-card
            @click="
              () => emits('on-selected', `/cards/T_Card${element.id}.png`)
            "
          >
            <v-img
              :src="`/cards/T_Card${element.id}.png`"
              class="w-100 h-100"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn :text="$t('common.close')" @click="() => emits('on-close')" />
    </v-card-actions>
  </v-card>
</template>
