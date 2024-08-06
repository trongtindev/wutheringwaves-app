<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

// computed
const currentLanguage = computed(() => {
  return locales.value.find((e) => e.code === locale.value)!;
});
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-list-item rounded :title="currentLanguage.name" v-bind="props">
        <template #append>
          <v-avatar
            class="border"
            :size="24"
            :image="`/locales/${locale}.webp`"
            :cover="true"
          />
        </template>
      </v-list-item>
    </template>

    <v-sheet class="border rounded">
      <v-list density="compact">
        <v-list-item
          v-for="(element, index) in locales"
          :key="index"
          :value="index"
          :disabled="locale === element.code"
          :to="switchLocalePath(element.code)"
        >
          <v-list-item-title>{{ element.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>
</template>
