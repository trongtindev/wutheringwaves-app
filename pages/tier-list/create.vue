<script setup lang="ts">
import { mdiFileExport, mdiShare } from '@mdi/js';
import {
  type ITierList,
  type ITierListRow,
  type TierListItem,
  type TierListType,
} from '@/interfaces/tier-list';
import type { ICharacter } from '@/interfaces/character';
import type { IWeapon } from '@/interfaces/weapon';
import type { IEcho } from '@/interfaces/echo';

// uses
const api = useApi();
const auth = useAuth();
const i18n = useI18n();
const localePath = useLocalePath();
const dialog = useDialog();
const snackbar = useSnackbar();
const clipboard = useClipboard();
const resources = useResources();
const router = useRouter();

// states
const state = ref<'' | 'submit' | 'live-voting'>('');
const type = ref<TierListType>('character');
const characters = ref<ICharacter[]>([]);
const weapons = ref<IWeapon[]>([]);
const echoes = ref<IEcho[]>([]);
const rows = ref<ITierListRow[]>([]);
const dragItem = ref<TierListItem>(null as any);
const dragPreviousRow = ref<ITierListRow | null>();
const title = ref<string>();
const item = ref<ITierList>();

// events
const onPressedLiveVoting = () => liveVoting();

// functions
const initialize = () => {
  title.value = `${i18n.t('common.draft')} #${randomId()}`;
  rows.value = [
    {
      label: 'S',
      items: [],
      color: '#ff7f7f',
    },
    {
      label: 'A',
      items: [],
      color: '#ffbf7f',
    },
    {
      label: 'B',
      items: [],
      color: '#ffff7f',
    },
    {
      label: 'C',
      items: [],
      color: '#bfff7f',
    },
  ].map((e) => {
    return { ...e, id: randomId() };
  });

  switch (type.value) {
    case 'character':
      resources.getCharacters().then((result) => {
        characters.value = result;
      });
      break;

    case 'weapon':
      resources.weapons().then((result) => {
        weapons.value = result;
      });
      break;

    case 'echo':
      resources.getEchoes().then((result) => {
        echoes.value = result;
      });
      break;
  }
};

const submit = async () => {
  if (!auth.isLoggedIn) {
    dialog.show({
      title: i18n.t('common.signInRequired'),
      content: i18n.t('common.signInRequiredMessage'),
      onConfirm: () => {
        auth.signIn().then(() => submit());
      },
    });
  } else {
    state.value = 'submit';
    return new Promise((resolve, reject) => {
      api
        .post<ITierList>(
          item.value ? `tier-list/${item.value.id}` : 'tier-list',
          {
            type: type.value,
            title: title.value,
            rows: rows.value.map((e) => {
              return {
                label: e.label,
                color: e.color,
                items: e.items.map((e) => e.slug),
              };
            }),
          },
        )
        .then((result) => {
          resolve(result);

          router.push(`/tier-list/${result.data.id}`);
          snackbar.show({
            content: i18n.t('tierList.create.saveSuccessfully'),
          });
        })
        .catch((error) => {
          reject(error);
          alert(error);
        })
        .finally(() => {
          state.value = '';
        });
    });
  }
};

const copyLink = async () => {
  if (!auth.isLoggedIn) {
    dialog.show({
      title: i18n.t('common.signInRequired'),
      content: i18n.t('common.signInRequiredMessage'),
      onConfirm: () => {
        auth.signIn().then(() => submit());
      },
    });
  } else if (!item.value) {
    // submit().then(() => copyLink());
  } else if (item.value) {
    // const url = `${import.meta.env.SITE_URL}/tier-list/${item.value.id}`;
    // await clipboard.copy(url);
    // snackbar.show({
    //   content: i18n.t('common.successfullyCopied')
    // });
  }
};

const liveVoting = () => {
  if (!auth.isLoggedIn) {
    dialog.show({
      title: i18n.t('common.signInRequired'),
      content: i18n.t('common.signInRequiredMessage'),
      onConfirm: () => {
        auth.signIn().then(() => submit());
      },
    });
  } else if (!item.value) {
    submit().then(() => liveVoting());
  } else {
    dialog.show({
      title: i18n.t('common.comingSoon'),
      content: i18n.t('common.comingSoonMessage'),
    });
  }
};

// computed
const excludeAddedItems = computed<TierListItem[]>(() => {
  const excludes = rows.value
    .map((e) => {
      return e.items.map((e) => {
        return e.slug;
      });
    })
    .flatMap((e) => e);

  const data = (() => {
    switch (type.value) {
      case 'character':
        return characters.value;

      case 'weapon':
        return weapons.value;

      case 'echo':
        return echoes.value;
    }
  })();
  return data.filter((e) => {
    return !excludes.includes(e.slug);
  });
});

// events
const onDragStart = (args: TierListItem, previous?: ITierListRow) => {
  // console.debug('onDragStart', args, previous);
  dragItem.value = args;
  dragPreviousRow.value = previous;
};

const onDrop = (args: ITierListRow, parent?: TierListItem) => {
  // console.debug('onDrop', args, parent);
  if (parent) {
    console.log('onDrop', 'swap', parent);
  }
  dragItem.value = null as any;
  dragPreviousRow.value = null;
};

const onDragEnd = () => {
  dragItem.value = null as any;
  dragPreviousRow.value = null;
};

const onDragEnter = (row: ITierListRow) => {
  // console.debug('onDragEnter', row, dragItem.value);
  if (!dragItem.value) return;

  if (dragPreviousRow.value) {
    const previousRowIndex = rows.value.findIndex(
      (e) => e.id === dragPreviousRow.value?.id,
    );
    const previousRowItemIndex = rows.value[previousRowIndex].items.findIndex(
      (e) => e.slug === dragItem.value.slug,
    );

    dragPreviousRow.value = null;

    if (previousRowItemIndex >= 0) {
      rows.value[previousRowIndex].items.splice(previousRowItemIndex, 1);
    }
  }

  const rowIndex = rows.value.findIndex((e) => e.id === row.id);
  const itemIndex = rows.value[rowIndex].items.findIndex(
    (e) => e.slug === dragItem.value.slug,
  );

  if (itemIndex <= 0) {
    rows.value[rowIndex].items.push(dragItem.value);
  }
};

const onDragLeave = (row: ITierListRow) => {
  // console.debug('onDragLeave', row, dragItem.value);
  if (!dragItem.value) return;

  const rowIndex = rows.value.findIndex((e) => e.id === row.id);
  const itemIndex = rows.value[rowIndex].items.findIndex(
    (e) => e.slug === dragItem.value.slug,
  );

  if (itemIndex >= 0) {
    rows.value[rowIndex].items.splice(itemIndex, 1);
  }
};

// computed
const isNameError = computed(() => {
  if (title.value) {
    return title.value.length < 6 || title.value.length > 50;
  }
  return false;
});

const canSubmit = computed(() => {
  return title.value && !isNameError.value;
});

// changes
watch(
  () => type.value,
  () => initialize(),
);

// lifecycle
onMounted(() => {
  if (import.meta.client) {
    initialize();
  }
});

// seo meta
useHead({
  title: i18n.t('tierList.create.title'),
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/tier-list',
          title: i18n.t('tierList.title'),
        },
        {
          to: '/tier-list/create',
          title: i18n.t('common.create'),
        },
      ]"
    />

    <v-card>
      <card-title>
        <template #title>
          {{ i18n.t('tierList.create.title') }}
        </template>
      </card-title>

      <v-card-text>
        <div>
          <v-text-field
            v-model="title"
            :label="$t('common.title')"
            :maxlength="50"
            :error="isNameError"
          />
        </div>

        <div class="mt-4">
          <v-btn-toggle
            v-model="type"
            variant="outlined"
            divided
          >
            <v-btn
              value="character"
              :text="$t('common.character')"
            />
            <v-btn
              value="weapon"
              :text="$t('common.weapon')"
            />
            <v-btn
              value="echo"
              :text="$t('common.echo')"
            />
          </v-btn-toggle>
        </div>

        <div
          v-for="(element, index) in rows"
          :key="index"
          class="mt-4"
        >
          <tier-list-row
            :type="type"
            :data="element"
            :class="index > 0 ? 'mt-2' : ''"
            :editor="true"
            @on-drag-start="(e) => onDragStart(e, element)"
            @on-drop="(parent) => onDrop(element, parent)"
            @on-drag-enter="() => onDragEnter(element)"
            @on-drag-leave="() => onDragLeave(element)"
          />
        </div>
      </v-card-text>
      <v-divider />

      <v-card-text>
        <v-sheet class="d-flex overflow-x-scroll">
          <v-sheet
            v-if="excludeAddedItems.length == 0"
            :width="100"
            class="rounded border"
            :height="100"
          />

          <v-sheet
            v-for="(element, index) in excludeAddedItems"
            :key="element.slug"
            class="rounded border cursor-grab"
            :ondragstart="() => onDragStart(element)"
            :ondragend="() => onDragEnd()"
            :class="index > 0 ? 'ml-2' : ''"
            :width="100"
            :height="100"
            :draggable="true"
          >
            <v-sheet
              class="rounded cursor-grab"
              :width="100"
              :height="100"
              :style="`background-size: cover;background-image: url(/${type}s/icons/${element.slug}.webp)`"
            />
          </v-sheet>
        </v-sheet>
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              :disabled="state != '' || !canSubmit"
              :text="$t('common.copyLink')"
              :prepend-icon="mdiShare"
              @click="copyLink"
            />

            <v-btn
              :disabled="state != '' || !canSubmit"
              :text="$t('common.exportAsImage')"
              :prepend-icon="mdiFileExport"
            />
          </v-col>

          <v-col class="d-flex justify-end">
            <v-btn
              :disabled="state != '' || !canSubmit"
              :loading="state == 'live-voting'"
              variant="flat"
              color="secondary"
              :text="$t('tierList.create.liveVoting')"
              @click="onPressedLiveVoting"
            >
              <template #prepend>
                <v-sheet
                  class="rounded-circle bg-red d-flex align-center justify-center"
                  :width="10"
                  :height="10"
                />
              </template>
            </v-btn>

            <v-btn
              :disabled="state != '' || !canSubmit"
              :loading="state == 'submit'"
              variant="flat"
              :text="$t('common.saveAndPublish')"
              :prepend-icon="mdiFileExport"
              @click="submit"
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>
