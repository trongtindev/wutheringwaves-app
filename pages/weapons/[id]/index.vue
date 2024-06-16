<script setup lang="ts">
import { mdiPlus } from '@mdi/js';

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// fetch
const weapons = await resources.weapons();
const item = weapons.find((e) => e.slug == route.params.id);
if (!item) throw createError({ statusCode: 404 });
const data = await resources.getWeaponData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// states
const level = ref(1);

// computed
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

const currentAscension = computed(() => {
  return data!.ascensionsAndStats.find((e) => {
    return e.stats.find((e) => e.level == level.value);
  });
});

const currentAscensionStats = computed(() => {
  if (currentAscension.value) {
    return currentAscension.value.stats[0].level <= level.value
      ? currentAscension.value.stats[0]
      : currentAscension.value.stats[1];
  }
});

// events
const onPressedAddTodo = () => {
  router.push({
    path: '/todo-list/create/weapon',
    query: {
      name: item.name
    }
  });
};

// computed
const baseStats = computed(() => {
  if (currentAscensionStats.value) {
    return `${currentAscensionStats.value.baseStats}`;
  }
  return 0;
});

const subStats = computed(() => {
  if (currentAscensionStats.value) {
    return `${currentAscensionStats.value.substats}`;
  }
  return 0;
});

// initialize
if (item && data) {
  const title = `${i18n.t('Weapon')}: ${nameLocalized.value}`;
  const description = i18n.t('meta.weapons.id.description', {
    name: nameLocalized.value,
    type: item.type
  });
  const ogImage = `${runtimeConfig.public.SITE_URL}/weapons/icons/${item.slug}.png`;

  useHead({ title });

  useSeoMeta({
    ogTitle: title,
    description,
    ogDescription: description,
    ogImage
  });

  useJsonld({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${runtimeConfig.public.SITE_URL}/weapons/icons/${item.slug}.png`,
    creditText: 'Wuthering Waves',
    creator: {
      '@type': 'Organization',
      name: 'Wuthering Waves'
    }
  });
} else {
  router.push('/404.html');
}
</script>

<template>
  <div v-if="item && data">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/weapons',
          title: i18n.t('weapons.title')
        },
        {
          to: `/weapons/${item.slug}`,
          title: i18n.t(item.name)
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t(item.name) }}
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-sheet class="border rounded hidden-sm-and-down">
              <v-img
                :src="`/weapons/icons/${item.slug}.png`"
                :alt="item.name"
              />
            </v-sheet>

            <div class="hidden-md-and-up">
              <v-img
                class="border rounded"
                :src="`/weapons/icons/${item.slug}.png`"
                :alt="item.name"
                :width="128"
                :height="128"
              />
            </div>
          </v-col>

          <v-col cols="12" md="8">
            <div>
              {{ data.description }}
            </div>
            <v-divider class="mt-4 mb-4" />

            <v-row>
              <v-col cols="6">
                <v-list-item :title="$t('common.type')">
                  <v-chip :text="item.type" />
                </v-list-item>
              </v-col>
              <v-col cols="6">
                <v-list-item
                  :title="$t('common.rarity')"
                  :subtitle="item.rarity"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  :title="$t('common.baseStats')"
                  :subtitle="baseStats"
                />
              </v-col>
              <v-col cols="6">
                <v-list-item
                  :title="$t('common.subStats')"
                  :subtitle="subStats"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  :title="$t('common.previewLevel')"
                  :subtitle="level"
                />
              </v-col>
            </v-row>

            <div>
              {{ currentAscension }}
              <v-slider v-model="level" :max="80" :min="1" :step="10" />
            </div>
          </v-col>
        </v-row>

        <!-- <v-alert
          v-if="item.skill"
          class="mt-4"
          :title="item.skill.name"
          :text="item.skill.description"
        /> -->
      </v-card-text>
    </v-card>

    <!-- Ranks -->
    <v-card class="mt-4">
      <v-card-title>
        {{ $t('weapons.ranks') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-alert
          v-for="(element, index) in data.ranks"
          :key="index"
          :title="`${i18n.t('common.level')} ${index + 1}`"
          :class="{
            'mt-4': index > 0
          }"
          :text="element"
        />
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex align-center justify-end">
        <v-btn
          :text="$t('Add to Todo list')"
          :append-icon="mdiPlus"
          variant="outlined"
          @click="onPressedAddTodo"
        />
      </v-card-actions>
    </v-card>

    <!-- Ascensions Cost -->
    <v-card class="mt-4">
      <v-card-title>
        {{ $t('weapons.ascensionsCost') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ data.ascensionsAndStats }}
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex align-center justify-end"> </v-card-actions>
    </v-card>

    <v-row>
      <v-col cols="12" sm="6">
        <!-- Upgrade Materials -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('Upgrade Materials') }}
          </v-card-title>
          <v-divider />

          <v-card-text></v-card-text>
          <v-divider />

          <v-card-actions class="d-flex align-center justify-end">
            <v-btn
              :text="$t('Add to Todo list')"
              :append-icon="mdiPlus"
              variant="outlined"
              @click="onPressedAddTodo"
            />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <!-- Recommended Characters -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('Recommended Characters') }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-4">
      <comments :channel="`character.${item.slug}`" />
    </div>
  </div>
</template>
