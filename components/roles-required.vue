<script setup lang="ts">
import type { UserRole } from '~/interfaces/user';

// define
const props = defineProps<{
  roles: UserRole[];
  type: 'any' | 'all';
}>();

// uses
const role = useRole();
const localePath = useLocalePath();

// states
const show = computed(() => {
  return !role.hasRoles(props.roles);
});
</script>

<template>
  <v-overlay
    v-model="show"
    :persistent="true"
    class="w-100 h-100 d-flex align-center justify-center"
  >
    <v-card :max-width="480">
      <v-card-title class="text-center">
        {{ $t('common.rolesRequired') }}
      </v-card-title>

      <v-card-text>
        <base-alert
          color="warning"
          :text="$t('common.rolesRequiredAnyMessage')"
        />

        <div class="mt-2 d-flex flex-wrap ga-2 justify-center">
          <v-chip
            v-for="(element, index) in props.roles"
            :key="index"
            :text="element"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn :text="$t('common.back')" :to="localePath('/guides')" />
        <v-spacer />
        <v-btn
          :text="$t('common.getRoles')"
          :to="localePath('/settings')"
          variant="flat"
        />
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
