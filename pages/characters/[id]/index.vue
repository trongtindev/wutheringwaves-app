<script setup lang="ts">
import { mdiPlus, mdiCake, mdiMapMarker, mdiSword, mdiPistol } from '@mdi/js';

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// states
const characters = await resources.characters();
const item = characters.find((e) => e.slug === route.params.id);
if (!item) throw createError({ statusCode: 404 });

const data = await resources.getCharacterData(item.slug);
if (!data) throw createError({ statusCode: 404 });

// events
const onPressedAddTodo = () => {
  router.push({
    path: '/todo-list/create/character',
    query: {
      name: item.name
    }
  });
};

// computed
const weaponIcon = computed(() => {
  switch (item.weapon) {
    case 'Pistols':
      return mdiPistol;
  }
  return mdiSword;
});

const nameLocalized = computed(() => {
  // if (data.nameLocalized && data.nameLocalized[i18n.locale.value]) {
  //   return data.nameLocalized[i18n.locale.value];
  // }
  return i18n.t(item.name);
});

// seo meta
const title = `${i18n.t('Character')}: ${nameLocalized.value}`;
const description = i18n.t('meta.characters.id.description', {
  name: nameLocalized.value,
  attribute: item.attribute
});
const ogImage = `${runtimeConfig.public.SITE_URL}/characters/icons/${item.slug}.png`;

useHead({ title });

useSeoMeta({
  ogImage: ogImage,
  description,
  ogDescription: description
});

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: `${runtimeConfig.public.SITE_URL}/characters/icons/${item.slug}.png`,
  license: `${runtimeConfig.public.SITE_URL}/license`,
  acquireLicensePage: `${runtimeConfig.public.SITE_URL}/license/#how-to-use`,
  creditText: 'Wuthering Waves',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  },
  copyrightNotice: 'trongtindev'
}));
</script>

<template>
  <div v-if="item && data">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/characters',
          title: i18n.t('characters.title')
        },
        {
          to: `/characters/${item.slug}`,
          title: i18n.t(item.name)
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          <div :class="`text-rarity${item.rarity}`">
            <span> {{ i18n.t(item.name) }}</span>
            <span class="ml-2"> {{ item.rarity }} ★ </span>
          </div>
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="d-flex justify-center align-center">
            <v-img
              :src="`/characters/portraits/${item.slug}.png`"
              :alt="i18n.t(item.name)"
            />
          </v-col>

          <v-col cols="12" md="8">
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                :text="$t(data.birthplace)"
                :prepend-icon="mdiMapMarker"
              />
              <v-chip :text="data.birthday" :prepend-icon="mdiCake" />
              <v-chip :text="$t(item.weapon)" :prepend-icon="weaponIcon" />
              <v-chip :text="$t(item.attribute)" />
            </div>
            {{ item }}
            {{ data }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Introduction -->
    <v-card class="mt-4">
      <v-card-title>
        {{ $t('characters.introduction') }}
      </v-card-title>
      <v-divider />

      <v-card-text>
        {{ data.quote }}
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" sm="6">
        <!-- Upgrade Materials -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('characters.resonanceChain') }}
          </v-card-title>
          <v-divider />

          <v-list>
            <v-list-item
              v-for="(element, index) in data.resonanceChain"
              :key="index"
              :title="$t(element.name)"
            >
              <template #prepend>
                <v-avatar class="border"> </v-avatar>
              </template>
            </v-list-item>
          </v-list>
          <v-divider />
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <!-- Upgrade Materials -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('characters.ascensionMaterials') }}
          </v-card-title>
          <v-divider />

          <v-list>
            <v-list-item
              v-for="(element, index) in data.ascensionMaterials"
              :key="index"
              :subtitle="`x${formatNumber(element.amount)}`"
            >
              <template #prepend>
                <v-avatar class="border rounded"></v-avatar>
              </template>

              <template #title>
                <item-inspector :name="element.name" />
              </template>
            </v-list-item>
          </v-list>
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
            {{ $t('Recommended Weapons') }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-4">
      <comments :channel="route.path" />
    </div>
  </div>
</template>
