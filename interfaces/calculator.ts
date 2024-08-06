import type { ICharacter, ICharacterData } from './character';
import type { IEcho, IEchoData } from './echo';
import type { IWeapon, IWeaponData } from './weapon';

export interface ICalculatorCharacter {
  item: ICharacter;
  data: ICharacterData;
}

export interface ICalculatorWeapon {
  item: IWeapon;
  data: IWeaponData;
}

export interface ICalculatorEcho {
  level: number;
  item?: IEcho;
  data?: IEchoData;
}

export interface ICalculatorParticipant {
  character?: ICalculatorCharacter;
  characterLevel: number;
  characterSequences: number;
  weapon?: ICalculatorWeapon;
  weaponLevel: number;
  weaponRank: number;
  echoes: ICalculatorEcho[];
}
