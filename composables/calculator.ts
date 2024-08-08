import type { ICalculatorParticipant } from '~/interfaces/calculator';

export const useCalculator = defineStore('useCalculator', () => {
  const INITIAL_PARTICIPANTS = () => {
    return Array.from(Array(3).keys()).map(() => {
      return {
        characterLevel: 90,
        characterSequences: 0,
        weaponLevel: 90,
        weaponRank: 1,
        echoes: Array.from(Array(5).keys()).map(() => {
          return {
            level: 20,
            rarity: 5,
          };
        }),
      };
    });
  };

  // states
  const participant = ref(0);
  const participants = ref<ICalculatorParticipant[]>(INITIAL_PARTICIPANTS());

  // functions
  const reset = () => {
    participants.value = INITIAL_PARTICIPANTS();
  };

  const start = () => {};

  // exports
  return { participant, participants, reset, start };
});
