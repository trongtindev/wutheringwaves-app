<script setup lang="ts">
import { mdiAccountGroup, mdiBagPersonal, mdiLineScan } from '@mdi/js';

// uses
const localePath = useLocalePath();
</script>

<template>
  <v-navigation-drawer
    :permanent="true"
    :expand-on-hover="true"
    rail
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :to="localePath(`/calculator`)"
        :title="$t('calculator.builder.title')"
      >
        <template #prepend>
          <v-avatar
            :size="24"
            rounded
          >
            <v-icon :icon="mdiAccountGroup" />
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item
        :to="localePath(`/calculator/import`)"
        :title="$t('calculator.import.title')"
      >
        <template #prepend>
          <v-avatar
            :size="24"
            rounded
          >
            <v-icon :icon="mdiLineScan" />
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item
        :to="localePath(`/calculator/inventory`)"
        :title="$t('calculator.inventory.title')"
      >
        <template #prepend>
          <v-avatar
            :size="24"
            rounded
          >
            <v-icon :icon="mdiBagPersonal" />
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <!-- <template #append>
        <v-spacer />

        <v-list density="compact" nav>
          <v-list-item
            :prepend-icon="mdiShareVariant"
            :title="$t('common.share')"
            :disabled="true"
          />
        </v-list>
      </template> -->
  </v-navigation-drawer>
</template>
