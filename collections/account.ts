import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type AccountDocType = {
  name?: string;
  playerId: string;
  serverId: string;
  conveneHistoryUrl: string;
  createdAt: number;
};

export type AccountDocMethods = {
  /** Something */
};

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
  version: 2,
  keyCompression: false,
  primaryKey: 'playerId',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    playerId: {
      type: 'string',
      maxLength: 50
    },
    serverId: {
      type: 'string'
    },
    conveneHistoryUrl: {
      type: 'string',
      default: ''
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['playerId', 'serverId']
};
