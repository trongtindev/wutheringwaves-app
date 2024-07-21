export interface IEcho {
  slug: string;
  name: string;
  cost: number;
  class: string;
  attribute: string;
  sonataEffects: string[];
  publishedTime?: string;
  modifiedTime?: string;
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
