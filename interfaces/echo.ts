export interface IEcho {
  slug: string;
  name: string;
  cost: number;
  class: string;
  attribute: string;
  sonataEffects: string[];
}

export interface IEchoData {
  /**
   * When the data was first published.
   * @example '1970-01-01T00:00:00.000Z'
   */
  publishedTime?: string;
  /**
   * When the data was last changed.
   * @example '1970-01-01T00:00:00.000Z'
   */
  modifiedTime?: string;
  description: string;
  skill: {
    id: number;
    cd: number;
    params: string[];
    description: string;
  };
}
