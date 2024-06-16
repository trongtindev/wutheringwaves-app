<script setup lang="ts">
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const resources = useResources();
const runtimeConfig = useRuntimeConfig();

// states
const echos = await resources.echos();
const item = echos.find((e) => e.slug === route.params.id)!;
if (!item) throw createError({ statusCode: 404 });

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
const nameLocalized = computed(() => {
  return i18n.t(item.name);
});

// seo meta
const title = `${i18n.t('common.echo')}: ${nameLocalized.value}`;
const description = i18n.t('meta.echos.description', {
  name: nameLocalized.value,
  rarity: item.class
});
const ogImage = `${runtimeConfig.public.SITE_URL}/echos/icons/${item.slug}.png`;

useHead({ title });

useSeoMeta({
  description,
  ogDescription: description,
  ogImage
});

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: ogImage,
  creditText: 'Wuthering Waves',
  creator: {
    '@type': 'Organization',
    name: 'Wuthering Waves'
  }
});
</script>

<template>
  <div v-if="item">
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/echos',
          title: i18n.t('echos.title')
        },
        {
          to: `/echos/${item.slug}`,
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
          <v-col cols="4">
            <v-img :src="`/echos/icons/${item.slug}.png`" :height="256" />
          </v-col>

          <v-col>
            {{ item }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" sm="6">
        <!-- Skill -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('common.skill') }}
          </v-card-title>
          <v-divider />

          <v-card-text />
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <!-- Same Element Characters -->
        <v-card class="mt-4">
          <v-card-title>
            {{ $t('echos.sameElementCharacters') }}
          </v-card-title>
          <v-divider />

          <v-card-text />
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-4">
      <comments :channel="`echos.${item.slug}`" />
    </div>
  </div>
</template>
