import { CalculatorManager } from '~/calculator/manager';
import type { ICalculatorParticipant } from '~/interfaces/calculator';
import type { ICharacterSkillData } from '~/interfaces/character';

export const useCalculator = defineStore('useCalculator', () => {
  const INITIAL_PARTICIPANTS = () => {
    return Array.from(Array(3).keys()).map(() => {
      return {
        characterLevel: 90,
        characterSequences: 0,
        characterOutroSkillLevel: 1,
        weaponLevel: 90,
        weaponRank: 1,
        echoes: Array.from(Array(5).keys()).map(() => {
          return {
            level: 25,
            rarity: 5,
          };
        }),
        _echoes: '',
        sonatas: [],
        rotations: [],
      };
    });
  };

  // uses
  const { t } = useI18n();
  const dialog = useDialog();
  const manager = new CalculatorManager();

  // states
  const participant = useLocalStorage('calculator.participant', 0);
  const participants = useLocalStorage<ICalculatorParticipant[]>(
    'calculator.participants',
    INITIAL_PARTICIPANTS(),
  );
  const rotations = useLocalStorage<[string, ICharacterSkillData][]>(
    'calculator.rotations',
    [],
  );

  // functions
  const reset = () => {
    participants.value = INITIAL_PARTICIPANTS();
    rotations.value = [];
  };

  const start = () => {
    dialog.show({
      title: t('common.upcoming'),
      content:
        'Thank you for your interest in this feature, which is currently under development. Join the Discord to follow the progress!',
    });
  };

  // exports
  return { participant, participants, rotations, reset, start };
});
