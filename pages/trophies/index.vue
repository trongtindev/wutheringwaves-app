<script setup lang="ts">
import type { ITrophy, ITrophyGroup } from '~/interfaces/trophy';

// define
type DisplayItem = ITrophy & {
  items: ITrophy[];
};

// uses
const i18n = useI18n();
const database = useDatabase();
const resources = useResources();

// data
const data = await resources.getTrophyData();
const items = await resources.getTrophies();

// states
const filterText = ref();
const filterGroup = ref<ITrophyGroup>(data.groups[0]);
const filterCategory = ref();
const matchItems = ref<ITrophy[]>([]);
const displayItems = ref<DisplayItem[]>([]);
const debouncedSearch = useDebounceFn(() => initialize(), 350);
const checkedItems = ref<string[]>([]);
const percentage = ref<{ [key: string]: number }>({});
const refreshStatisticThrottle = useThrottleFn(() => {
  data.groups.forEach((group) => {
    percentage.value[group.slug] = checkedItems.value.filter((slug) => {
      const item = data.items.find((e) => e.slug === slug);
      return item && item.group === group.name;
    }).length;
  });
}, 250);

// functions
const initialize = () => {
  database.getInstance().then((db) => {
    db.trophies
      .find()
      .exec()
      .then((result) => {
        checkedItems.value = result.map((e) => e.slug);
        refreshStatisticThrottle();
      });
  });

  matchItems.value = items.filter((e) => {
    if (filterText.value) {
      // TODO: search in nameLocalized
      return e.name.toLowerCase().includes(filterText.value.toLowerCase());
    }
    return filterGroup.value.name === e.group && !e.dependOn;
  });

  displayItems.value = matchItems.value.map((e) => {
    return {
      ...e,
      items: items.filter((item) => item.dependOn && item.dependOn === e.name)
    };
  });
};

// events
const onItemChecked = async (slug: string, value: boolean) => {
  console.log('onItemChecked', slug, value);

  const db = await database.getInstance();
  if (value) {
    checkedItems.value.push(slug);
    await db.trophies.upsert({ slug });
  } else {
    const index = checkedItems.value.findIndex((e) => e === slug);
    if (index >= 0) checkedItems.value.splice(index, 1);

    const doc = await db.trophies
      .findOne({
        selector: {
          slug
        }
      })
      .exec();
    if (doc) doc.remove();
  }
  refreshStatisticThrottle();
};

// changes
watch(filterText, () => debouncedSearch());
watch(filterGroup, () => initialize());
watch(filterCategory, () => initialize());

// lifecycle
onMounted(() => initialize());

// seo meta
const title = i18n.t('meta.trophies.title');
const description = i18n.t('meta.trophies.description');

useApp().title = i18n.t('trophies.title');
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

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-list rounded>
            <v-list-item
              v-for="(element, index) in data.groups"
              :key="index"
              :class="{ 'mt-2': index > 0 }"
              :active="element.name === filterGroup.name"
              @click="() => (filterGroup = element)"
            >
              <v-list-item-title>
                {{ element.name }}
              </v-list-item-title>

              <v-list-item-subtitle class="mb-1">
                {{ percentage[element.slug] || 0 }}/{{ element.total }}
              </v-list-item-subtitle>

              <template #append>
                <v-progress-circular
                  :model-value="
                    (percentage[element.slug] / element.total) * 100
                  "
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <div v-for="(element, index) in displayItems" :key="index">
          <trophy-item-group
            v-if="element.items.length > 0"
            :data="element"
            :items="element.items"
            :class="{ 'mt-2': index > 0 }"
            :checked-items="checkedItems"
            @on-checked="(slug, val) => onItemChecked(slug, val)"
          />
          <v-card v-else :class="{ 'mt-2': index > 0 }">
            <trophy-item
              :data="element"
              :checked-items="checkedItems"
              @on-checked="(val) => onItemChecked(element.slug, val)"
            />
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
