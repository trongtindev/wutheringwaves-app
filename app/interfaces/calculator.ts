import type {
  ICharacter,
  ICharacterData,
  ICharacterSkillData,
} from './character';
import type { IEcho, IEchoData } from './echo';
import type { ISonata } from './sonata';
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
  rarity: number;
  item?: IEcho;
  data?: IEchoData;
  mainstats?: [string, number];
  substats?: [string, number][];
}

export interface ICalculatorParticipant {
  character?: ICalculatorCharacter;
  characterLevel: number;
  characterSequences: number;
  characterOutroSkillLevel: number;
  weapon?: ICalculatorWeapon;
  weaponLevel: number;
  weaponRank: number;
  echoes: ICalculatorEcho[];
  _echoes: string;
  sonatas: ISonata[];
}
