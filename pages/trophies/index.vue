<script setup lang="ts">
// uses
const i18n = useI18n();
const resources = useResources();
const localePath = useLocalePath();

// data
const items = await resources.getTrophies();

// states
const page = ref(1);
const limit = ref(48);
const filterText = ref();
const filterGroup = ref();
const filterCategory = ref();

// computed.value
const matchItems = computed(() => {
  return items.filter((e) => {
    if (filterText.value) {
      // TODO: search in nameLocalized
      return e.name.toLowerCase().includes(filterText.value.toLowerCase());
    }
    return true;
  });
});

const displayItems = computed(() => {
  const offset = limit.value * page.value - limit.value;
  return matchItems.value.filter((e, i) => {
    return i >= offset && i < offset + limit.value;
  });
});

const pages = computed(() => {
  return Math.ceil(matchItems.value.length / limit.value);
});

// seo meta
const title = i18n.t('meta.trophies.title');
const description = i18n.t('meta.trophies.description');

useHead({ title });

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/trophies',
          title: i18n.t('trophies.title')
        }
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ $t('trophies.title') }} ({{ matchItems.length }})
        </template>

        <template #actions>
          <contribute-button />
        </template>
      </card-title>

      <v-card-text>
        <client-only>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="filterText" :label="$t('common.search')" />
            </v-col>

            <v-col cols="6" md="4">
              <v-select
                v-model="filterGroup"
                :label="$t('common.group')"
                :item-title="(e) => e"
              />
            </v-col>

            <v-col cols="6" md="4">
              <v-select
                v-model="filterCategory"
                :label="$t('common.category')"
                :item-title="(e) => e"
              />
            </v-col>
          </v-row>
        </client-only>

        <v-row class="mt-4">
          <v-col
            v-for="(element, index) in displayItems"
            :key="index"
            cols="6"
            sm="4"
            md="2"
          >
            <v-card :to="localePath(`/trophies/${element.slug}`)">
              <v-responsive :aspect-ratio="1 / 1">
                <v-img
                  :src="`/trophies/icons/${element.slug}.webp`"
                  :alt="$t(element.name)"
                  class="align-end h-100"
                  cover
                />
              </v-responsive>

              <v-tooltip :text="$t(element.name)">
                <template #activator="{ props }">
                  <v-card-title v-bind="props" class="text-center">
                    {{ $t(element.name) }}
                  </v-card-title>
                </template>
              </v-tooltip>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />

      <v-card-actions class="d-flex justify-center">
        <client-only>
          <v-pagination v-model="page" :length="pages" />
        </client-only>
      </v-card-actions>
    </v-card>
  </div>
</template>
