import type { ISnackbar } from '@/interfaces/snackbar';
import { defineStore } from 'pinia';
import { createId } from '@paralleldrive/cuid2';

export const useSnackbar = defineStore('useSnackbar', () => {
  // states
  const queues = ref<ISnackbar[]>([]);
  const isCreated = ref();

  // functions
  const show = (args: Partial<ISnackbar>) => {
    args._id = createId();
    queues.value.push(args as ISnackbar);
    isCreated.value = createId();
  };

  // exports
  return { queues, isCreated, show };
});
