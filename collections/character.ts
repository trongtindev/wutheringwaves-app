import type {
  RxDocument,
  RxCollection,
  RxJsonSchema,
  MangoQuerySelector,
} from 'rxdb';

export type CharacterDocType = {
  key: string;
  name: string;
  resonanceChain: number;
  obtainedAt: number;
  playerId: string;
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
  deleteMany: (selector: MangoQuerySelector<CharacterDocType>) => Promise<void>;
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
  },
  deleteMany: async function (
    this: CharacterCollection,
    selector: MangoQuerySelector<CharacterDocType>,
  ) {
    const docs = await this.find({
      selector,
    }).exec();
    await Promise.all(
      docs.map((e) => {
        return e.remove();
      }),
    );
  },
};

export const characterSchema: RxJsonSchema<CharacterDocType> = {
  version: 3,
  keyCompression: false,
  primaryKey: 'key',
  type: 'object',
  properties: {
    key: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    resonanceChain: {
      type: 'string',
      default: 0,
    },
    obtainedAt: {
      type: 'number',
    },
    playerId: {
      type: 'string',
      default: 0,
    },
    createdAt: {
      type: 'number',
    },
  },
  required: ['key', 'name', 'resonanceChain', 'obtainedAt', 'playerId'],
};
