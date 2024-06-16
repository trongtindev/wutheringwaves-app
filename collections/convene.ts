import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type ConveneDocType = {
  key: string;
  playerId: string;
  cardPoolType: number;
  qualityLevel: number;
  resourceId: number;
  resourceType: string | 'Weapons' | 'Resonators';
  name: string;
  time: string;
  createdAt: number;
};

export type ConveneDocMethods = {};

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
  version: 0,
  keyCompression: false,
  primaryKey: 'key',
  type: 'object',
  properties: {
    key: {
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
    resourceId: {
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
    createdAt: {
      type: 'number'
    }
  },
  required: [
    'key',
    'playerId',
    'cardPoolType',
    'qualityLevel',
    'resourceId',
    'resourceType',
    'name',
    'time'
  ]
};
