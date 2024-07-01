import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type ConveneDocType = {
  _id: string;
  playerId: string;
  cardPoolType: number;
  qualityLevel: number;
  resourceType: 'Weapons' | 'Resonators';
  name: string;
  time: string;
  pity: number;
  win: boolean;
  createdAt: number;
};

export type ConveneDocMethods = {
  /** Something */
};

export type ConveneDocument = RxDocument<ConveneDocType, ConveneDocMethods>;

export type ConveneCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

export type ConveneCollection = RxCollection<
  ConveneDocType,
  ConveneDocMethods,
  ConveneCollectionMethods
>;

export const conveneDocMethods: ConveneDocMethods = {
  // scream: function (this: ConveneDocument, what: string) {
  //   return this.firstName + ' screams: ' + what.toUpperCase();
  // }
};

export const conveneCollectionMethods: ConveneCollectionMethods = {
  countAllDocuments: async function (this: ConveneCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

export const conveneSchema: RxJsonSchema<ConveneDocType> = {
  version: 3,
  keyCompression: false,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 50
    },
    playerId: {
      type: 'string'
    },
    cardPoolType: {
      type: 'number'
    },
    qualityLevel: {
      type: 'number'
    },
    resourceType: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    time: {
      type: 'string'
    },
    pity: {
      type: 'number'
    },
    win: {
      type: 'boolean'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: [
    '_id',
    'playerId',
    'cardPoolType',
    'qualityLevel',
    'resourceType',
    'name',
    'time'
  ]
};
