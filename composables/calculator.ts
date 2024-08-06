import type {
  ICalculatorEcho,
  ICalculatorParticipant,
} from '~/interfaces/calculator';

export const useCalculator = defineStore('useCalculator', () => {
  const INITIAL_PARTICIPANTS = Array.from(Array(3).keys()).map(() => {
    return {
      characterLevel: 90,
      characterSequences: 0,
      weaponLevel: 90,
      weaponRank: 1,
      echoes: Array.from(Array(5).keys()).map(() => {
        return {
          level: 20,
        };
      }),
    };
  });

  // states
  const participant = ref(0);
  const participants = ref<ICalculatorParticipant[]>(INITIAL_PARTICIPANTS);

  // functions
  const clear = () => {
    participants.value = INITIAL_PARTICIPANTS;
  };

  // exports
  return { participant, participants, clear };
});
