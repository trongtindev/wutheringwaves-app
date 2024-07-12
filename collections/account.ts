import type {
  RxDocument,
  RxCollection,
  RxJsonSchema,
  MangoQuerySelector
} from 'rxdb';

export type AccountDocType = {
  playerId: string;
  serverId: string;
  conveneHistoryUrl: string;
  createdAt: number;
  name?: string;
  autoImport?: boolean;
  lastImport?: number;
};

export type AccountDocMethods = {
  /** Something */
};

export type AccountDocument = RxDocument<AccountDocType, AccountDocMethods>;

export type AccountCollectionMethods = {
  countAllDocuments: () => Promise<number>;
  updateOne: (
    selector: MangoQuerySelector<AccountDocType>,
    patch: Partial<AccountDocType>
  ) => Promise<void>;
  deleteOne: (selector: MangoQuerySelector<AccountDocType>) => Promise<void>;
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
  },
  updateOne: async function (
    this: AccountCollection,
    selector: MangoQuerySelector<AccountDocType>,
    patch: Partial<AccountDocType>
  ) {
    const doc = await this.findOne({
      selector
    }).exec();
    if (doc) await doc.patch(patch);
  },
  deleteOne: async function (
    this: AccountCollection,
    selector: MangoQuerySelector<AccountDocType>
  ) {
    const doc = await this.findOne({
      selector
    }).exec();
    if (doc) await doc.remove();
  }
};

export const accountSchema: RxJsonSchema<AccountDocType> = {
  version: 4,
  keyCompression: false,
  primaryKey: 'playerId',
  type: 'object',
  properties: {
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
    },
    name: {
      type: 'string'
    },
    autoImport: {
      type: 'boolean'
    },
    lastImport: {
      type: 'number'
    }
  },
  required: ['playerId', 'serverId']
};
