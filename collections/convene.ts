import type {
  RxDocument,
  RxCollection,
  RxJsonSchema,
  MangoQuerySelector,
} from 'rxdb';

export type ConveneDocType = {
  _id: string;
  playerId: string;
  cardPoolType: number;
  qualityLevel: number;
  resourceId: number;
  resourceType: string;
  name: string;
  time: string;
  pity: number;
  createdAt: number;
};

export type ConveneDocMethods = {
  /** Something */
};

export type ConveneDocument = RxDocument<ConveneDocType, ConveneDocMethods>;

export type ConveneCollectionMethods = {
  countAllDocuments: () => Promise<number>;
  deleteMany: (selector: MangoQuerySelector<ConveneDocType>) => Promise<void>;
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
  },
  deleteMany: async function (
    this: ConveneCollection,
    selector: MangoQuerySelector<ConveneDocType>,
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

export const conveneSchema: RxJsonSchema<ConveneDocType> = {
  version: 6,
  keyCompression: false,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 50,
    },
    playerId: {
      type: 'string',
    },
    cardPoolType: {
      type: 'number',
    },
    qualityLevel: {
      type: 'number',
    },
    resourceId: {
      type: 'number',
    },
    resourceType: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    time: {
      type: 'string',
    },
    pity: {
      type: 'number',
    },
    createdAt: {
      type: 'number',
    },
  },
  required: [
    '_id',
    'playerId',
    'cardPoolType',
    'qualityLevel',
    'resourceId',
    'resourceType',
    'name',
    'time',
  ],
};
