import type { ICalculatorParticipant } from '~/interfaces/calculator';

export const useCalculator = defineStore('useCalculator', () => {
  // states
  const participants = ref<ICalculatorParticipant[]>([
    { level: 1, sequences: 0 },
    { level: 1, sequences: 0 },
    { level: 1, sequences: 0 },
  ]);

  // exports
  return { participants };
});
