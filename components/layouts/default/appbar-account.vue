<script setup lang="ts">
import { mdiAccountConvert, mdiChevronRight } from '@mdi/js';

// uses
const account = useAccount();
const localePath = useLocalePath();
</script>

<template>
  <client-only>
    <template #fallback></template>

    <v-menu
      v-if="account.items.length > 1"
      location="bottom right"
      :min-width="200"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :icon="mdiAccountConvert"
        />
      </template>

      <v-sheet :min-width="250">
        <v-list>
          <v-list-item
            v-for="(element, index) in account.items"
            :key="index"
            :value="index"
            :active="account.isActive(element.playerId)"
            :disabled="account.isActive(element.playerId)"
            :title="element.name || element.playerId"
            @click="() => account.setActive(element.playerId)"
          >
            <template #append>
              <v-chip
                v-if="account.isActive(element.playerId)"
                :text="$t('common.active')"
              />
              <v-icon
                v-else
                :icon="mdiChevronRight"
              />
            </template>
          </v-list-item>
        </v-list>

        <v-divider />
        <div class="pa-2">
          <v-btn
            variant="tonal"
            :to="localePath(`/settings`)"
            :block="true"
            :text="$t('settings.title')"
            :active="false"
          />
        </div>
      </v-sheet>
    </v-menu>
  </client-only>
</template>
