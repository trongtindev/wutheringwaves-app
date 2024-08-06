import type { IAttribute } from './common';
import type { ISonata } from './sonata';

export interface IEcho {
  slug: string;
  name: string;
  cost: number;
  icon: string;
  class: string;
  attribute: IAttribute;
  sonataEffects: ISonata[];
  hidden?: boolean;
  publishedTime: string;
  modifiedTime: string;
}

export interface IEchoData {
  description: string;
  skill: {
    id: number;
    cd: number;
    params: string[];
    description: string;
  };
}
