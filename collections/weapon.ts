import type {
  RxDocument,
  RxCollection,
  RxJsonSchema,
  MangoQuerySelector,
} from 'rxdb';

export type WeaponDocType = {
  key: string;
  count: number;
  resourceId: number;
  playerId: string;
  createdAt: number;
};

export type WeaponDocMethods = {
  /** Something */
};

export type WeaponDocument = RxDocument<WeaponDocType, WeaponDocMethods>;

export type WeaponCollectionMethods = {
  countAllDocuments: () => Promise<number>;
  deleteMany: (selector: MangoQuerySelector<WeaponDocType>) => Promise<void>;
};

export type WeaponCollection = RxCollection<
  WeaponDocType,
  WeaponDocMethods,
  WeaponCollectionMethods
>;

export const weaponDocMethods: WeaponDocMethods = {
  /** Something */
};

export const weaponCollectionMethods: WeaponCollectionMethods = {
  countAllDocuments: async function (this: WeaponCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
  deleteMany: async function (
    this: WeaponCollection,
    selector: MangoQuerySelector<WeaponDocType>,
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

export const weaponSchema: RxJsonSchema<WeaponDocType> = {
  version: 0,
  keyCompression: false,
  primaryKey: 'key',
  type: 'object',
  properties: {
    key: {
      type: 'string',
      maxLength: 100,
    },
    count: {
      type: 'number',
    },
    resourceId: {
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
  required: ['key', 'count', 'resourceId', 'playerId'],
};
