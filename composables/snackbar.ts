import type { ISnackbar } from '@/interfaces/snackbar';
import { defineStore } from 'pinia';

export const useSnackbar = defineStore('useSnackbar', () => {
  // states
  const queues = ref<ISnackbar[]>([]);
  const isCreated = ref();

  // functions
  const show = (args: Partial<ISnackbar>) => {
    args._id = randomId();
    queues.value.push(args as ISnackbar);
    isCreated.value = randomId();
  };

  // exports
  return { queues, isCreated, show };
});
