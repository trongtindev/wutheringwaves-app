import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type CharacterDocType = {
  name: string;
  resonanceChain: number;
  obtainedAt: number;
  createdAt: number;
};

export type CharacterDocMethods = {
  /** Something */
};

export type CharacterDocument = RxDocument<
  CharacterDocType,
  CharacterDocMethods
>;

export type CharacterCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

export type CharacterCollection = RxCollection<
  CharacterDocType,
  CharacterDocMethods,
  CharacterCollectionMethods
>;

export const characterDocMethods: CharacterDocMethods = {
  /** Something */
};

export const characterCollectionMethods: CharacterCollectionMethods = {
  countAllDocuments: async function (this: CharacterCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

export const characterSchema: RxJsonSchema<CharacterDocType> = {
  version: 0,
  keyCompression: false,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100
    },
    resonanceChain: {
      type: 'string',
      default: 0
    },
    obtainedAt: {
      type: 'number'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['name']
};
