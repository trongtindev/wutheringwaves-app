<script setup lang="ts">
import type { IListResponse } from '@/interfaces/api';
import type { IComment } from '@/interfaces/comment';
import { mdiSend, mdiImageSearch } from '@mdi/js';

const props = defineProps<{
  channel: string;
}>();

// uses
const api = useApi();
const auth = useAuth();
const fileChoose = useFileDialog({ accept: 'image/*' });
const runtimeConfig = useRuntimeConfig();

// states
const state = ref<'' | 'submit' | 'loading'>('loading');
const data = ref<IListResponse<IComment>>();
const limit = ref(20);
const offset = ref(0);
const page = ref(1);
const comment = ref<string>();

// computed
const total = computed(() => {
  return 0;
});

// functions
const loadData = (parent?: IComment) => {
  if (import.meta.server) {
    throw new Error('Cannot run this on server-side!');
  }

  state.value = 'loading';
  api
    .getInstance()
    .get<IListResponse<IComment>>(`/comments`, {
      params: {
        channel: `${runtimeConfig.public.SITE_URL}${props.channel}`,
        limit: limit.value,
        offset: offset.value,
        parent: parent ? parent.id : undefined
      }
    })
    .then((result) => {
      data.value = result.data;
    })
    .catch((error) => {
      data.value = {
        total: 0,
        items: []
      };
      // TODO: handle error
      console.error(error);
    })
    .finally(() => {
      state.value = '';
    });
};

// computed
const pages = computed(() => {
  if (data.value) {
    return Math.ceil(data.value.total / limit.value);
  }
  return 0;
});

// events
const onSubmit = () => {
  state.value = 'submit';
  api
    .getInstance()
    .post<IComment>(`/comments`, {
      channel: `${runtimeConfig.public.SITE_URL}${props.channel}`,
      comment: comment.value
    })
    .then((result) => {})
    .catch((error) => {
      // TODO: handle error
      console.log(error);
      alert(error);
    })
    .finally(() => {
      state.value = '';
    });
};

const onPressedAddAttachment = () => fileChoose.open();

// changes
watch(
  () => fileChoose.files,
  () => {
    console.log('fileChoose', fileChoose.files);
  }
);

// lifecycle
onMounted(() => loadData());
</script>

<template>
  <v-card>
    <v-card-title> {{ $t('Comments') }} ({{ total }}) </v-card-title>
    <v-divider />
    <v-card-actions>
      <v-form class="w-100" @submit.prevent="onSubmit">
        <v-text-field
          v-model="comment"
          :disabled="!auth.isLoggedIn || state != ''"
          :loading="state == 'submit'"
          :hide-details="true"
          :placeholder="$t('Write your comment here...')"
        >
          <template #append-inner>
            <v-icon :icon="mdiImageSearch" @click="onPressedAddAttachment" />
            <v-icon class="ml-2" :icon="mdiSend" @click="onSubmit" />
          </template>
        </v-text-field>
      </v-form>
    </v-card-actions>
    <v-divider />

    <client-only>
      <v-list v-if="!data">
        <v-skeleton-loader
          v-for="index in 5"
          :key="index"
          type="list-item-avatar-two-line"
        />
      </v-list>
      <v-card-text v-else-if="data.total === 0">
        <v-alert color="info" :text="$t('comments.empty')" />
      </v-card-text>

      <v-divider v-if="pages > 0" />
      <v-card-actions v-if="pages > 0" class="d-flex justify-center">
        <v-pagination v-model="page" :length="pages" />
      </v-card-actions>
    </client-only>
  </v-card>
</template>
