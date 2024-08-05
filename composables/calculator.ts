import type { ICalculatorParticipant } from '~/interfaces/calculator';

export const useCalculator = defineStore('useCalculator', () => {
  // states
  const participants = ref<ICalculatorParticipant[]>([
    {
      characterLevel: 90,
      characterSequences: 0,
      weaponLevel: 90,
      weaponRank: 1,
      echoes: [{}, {}, {}, {}, {}],
    },
    {
      characterLevel: 90,
      characterSequences: 0,
      weaponLevel: 90,
      weaponRank: 1,
      echoes: [{}, {}, {}, {}, {}],
    },
    {
      characterLevel: 90,
      characterSequences: 0,
      weaponLevel: 90,
      weaponRank: 1,
      echoes: [{}, {}, {}, {}, {}],
    },
  ]);

  // exports
  return { participants };
});
