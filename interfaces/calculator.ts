import type { ICharacter, ICharacterData } from './character';
import type { IWeapon, IWeaponData } from './weapon';

export interface ICalculatorWeapon {
  item: IWeapon;
  data: IWeaponData;
}

export interface ICalculatorCharacter {
  item: ICharacter;
  data: ICharacterData;
}

export interface ICalculatorParticipant {
  level: number;
  sequences: number;
  weapon?: ICalculatorWeapon;
  character?: ICalculatorCharacter;
}

export interface ICalculatorEcho {}
