<script setup lang="ts">
import dayjs from 'dayjs';
import { mdiThumbUp, mdiThumbDown, mdiDotsVertical } from '@mdi/js';
import type { IComment } from '~/interfaces/comment';

const props = defineProps<{
  data: IComment;
}>();

// uses
const api = useApi();

// states
const state = ref<'' | 'like' | 'dislike'>('');
const likes = ref(0);
const dislikes = ref(0);

// events
const onPressedLike = (type: 'like' | 'dislike') => {
  state.value = type;

  api
    .post<IComment>(`comments/${props.data.id}/likes`, {
      type
    })
    .then((result) => {
      // TODO: use emit
      props.data.likes = result.data.likes;
      props.data.dislikes = result.data.dislikes;
    })
    .finally(() => {
      state.value = '';
    });
};

const onPressedReply = () => {
  /** TODO */
};

// computed
const photoUrl = computed(() => {
  if (typeof props.data.user !== 'string') {
    return props.data.user.photoUrl;
  }
  return null;
});

const createdAt = computed(() => {
  return dayjs(props.data.createdAt).fromNow();
});
</script>

<template>
  <div>
    <v-hover>
      <template #default="hover">
        <v-list-item v-bind="hover.props">
          <v-list-item-title>
            <span>{{ props.data.user.name }}</span>
            <span> • </span>
            <span class="text-caption text-grey">{{ createdAt }}</span>
          </v-list-item-title>
          <template #prepend>
            <v-avatar class="border">
              <v-img v-if="photoUrl" :src="photoUrl" />
              <span v-else>?</span>
            </v-avatar>
          </template>

          <template #append>
            <v-btn
              v-if="hover.isHovering"
              variant="text"
              size="x-small"
              :icon="mdiDotsVertical"
            />
          </template>
        </v-list-item>
        <div class="pl-16">
          <div class="pl-2" :innerHTML="props.data.content" />
        </div>
      </template>
    </v-hover>

    <div class="pl-15 mt-2">
      <v-btn
        size="small"
        variant="text"
        color="white"
        :disabled="true || state != ''"
        :loading="state == 'like'"
        @click="() => onPressedLike('like')"
      >
        <v-icon :icon="mdiThumbUp" />
        <span class="ml-2">
          {{ likes }}
        </span>
      </v-btn>

      <v-btn
        size="small"
        variant="text"
        color="white"
        :disabled="true || state != ''"
        :loading="state == 'dislike'"
        @click="() => onPressedLike('dislike')"
      >
        <v-icon :icon="mdiThumbDown" />
        <span class="ml-2">
          {{ dislikes }}
        </span>
      </v-btn>

      <v-btn
        size="small"
        variant="text"
        color="white"
        :disabled="true"
        @click="onPressedReply"
      >
        <span>
          {{ $t('comments.replies') }}
        </span>
        <span class="ml-2"> 0 </span>
      </v-btn>
    </div>
  </div>
</template>
