import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type TrophyDocType = {
  slug: string;
  playerId: string;
  createdAt: number;
};

export type TrophyDocMethods = {
  /** Something */
};

export type TrophyDocument = RxDocument<TrophyDocType, TrophyDocMethods>;

export type TrophyCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

export type TrophyCollection = RxCollection<
  TrophyDocType,
  TrophyDocMethods,
  TrophyCollectionMethods
>;

export const trophyDocMethods: TrophyDocMethods = {
  /** Something */
};

export const trophyCollectionMethods: TrophyCollectionMethods = {
  countAllDocuments: async function (this: TrophyCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export const trophySchema: RxJsonSchema<TrophyDocType> = {
  version: 1,
  keyCompression: false,
  primaryKey: 'slug',
  type: 'object',
  properties: {
    slug: {
      type: 'string',
      maxLength: 50,
    },
    playerId: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
    },
  },
  required: ['slug', 'playerId'],
};
