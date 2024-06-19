import type { IDialogParams } from '../interfaces/dialog';
import { defineStore } from 'pinia';

export const useDialog = defineStore('useDialog', () => {
  // states
  const queues = ref<IDialogParams[]>([]);

  // functions
  const show = (params: IDialogParams) => {
    queues.value.push(params);
  };

  // exports
  return { queues, show };
});
