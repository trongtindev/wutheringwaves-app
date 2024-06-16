import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type AccountDocType = {
  playerId: string;
  conveneHistoryUrl: string;
  createdAt: number;
};

export type AccountDocMethods = {};

export type AccountDocument = RxDocument<AccountDocType, AccountDocMethods>;

export type AccountCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

export type AccountCollection = RxCollection<
  AccountDocType,
  AccountDocMethods,
  AccountCollectionMethods
>;

export const accountDocMethods: AccountDocMethods = {
  // scream: function (this: AccountDocument, what: string) {
  //   return this.firstName + ' screams: ' + what.toUpperCase();
  // }
};

export const accountCollectionMethods: AccountCollectionMethods = {
  countAllDocuments: async function (this: AccountCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

export const accountSchema: RxJsonSchema<AccountDocType> = {
  version: 0,
  keyCompression: false,
  primaryKey: 'playerId',
  type: 'object',
  properties: {
    playerId: {
      type: 'string',
      maxLength: 50
    },
    conveneHistoryUrl: {
      type: 'string',
      default: ''
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['playerId']
};
