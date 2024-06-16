export type EchoClass = 'Common' | 'Elite' | 'Overlord' | 'Calamity';

export interface IEcho {
  slug: string;
  name: string;
  cost: number;
  class: EchoClass;
  sonataEffects: string[];
  outline: string;
  description: string;
  ranks: number[] | { [key: string]: number }[];
  cooldown: string;
}
