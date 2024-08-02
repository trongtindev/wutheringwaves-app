import type {
  RxDocument,
  RxCollection,
  RxJsonSchema,
  MangoQuerySelector,
} from 'rxdb';

export type MarkerDocType = {
  key: string;
  type?: string;
  note?: string;
  playerId?: string;
  createdAt: number;
};

export type MarkerDocMethods = {
  /** Something */
};

export type MarkerDocument = RxDocument<MarkerDocType, MarkerDocMethods>;

export type MarkerCollectionMethods = {
  countAllDocuments: () => Promise<number>;
  deleteOne: (selector: MangoQuerySelector<MarkerDocType>) => Promise<void>;
};

export type MarkerCollection = RxCollection<
  MarkerDocType,
  MarkerDocMethods,
  MarkerCollectionMethods
>;

export const markerDocMethods: MarkerDocMethods = {
  // scream: function (this: MarkerDocument, what: string) {
  //   return this.firstName + ' screams: ' + what.toUpperCase();
  // }
};

export const markerCollectionMethods: MarkerCollectionMethods = {
  countAllDocuments: async function (this: MarkerCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
  deleteOne: async function (
    this: MarkerCollection,
    selector: MangoQuerySelector<MarkerDocType>,
  ) {
    const doc = await this.findOne({
      selector,
    }).exec();
    if (doc) await doc.remove();
  },
};

export const markerSchema: RxJsonSchema<MarkerDocType> = {
  version: 2,
  keyCompression: false,
  primaryKey: 'key',
  type: 'object',
  properties: {
    key: {
      type: 'string',
      maxLength: 50,
    },
    type: {
      type: 'string',
      default: null,
    },
    note: {
      type: 'string',
      default: null,
    },
    playerId: {
      type: 'string',
      default: null,
    },
    createdAt: {
      type: 'number',
    },
  },
  required: ['key'],
};
