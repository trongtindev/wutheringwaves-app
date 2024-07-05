import type { RxDocument, RxCollection, RxJsonSchema } from 'rxdb';

export type SettingDocType = {
  key: string;
  value: string;
  createdAt: number;
};

export type SettingDocMethods = {
  /** Something */
};

export type SettingDocument = RxDocument<SettingDocType, SettingDocMethods>;

export type SettingCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

export type SettingCollection = RxCollection<
  SettingDocType,
  SettingDocMethods,
  SettingCollectionMethods
>;

export const settingDocMethods: SettingDocMethods = {
  // scream: function (this: SettingDocument, what: string) {
  //   return this.firstName + ' screams: ' + what.toUpperCase();
  // }
};

export const settingCollectionMethods: SettingCollectionMethods = {
  countAllDocuments: async function (this: SettingCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

export const settingSchema: RxJsonSchema<SettingDocType> = {
  version: 0,
  keyCompression: false,
  primaryKey: 'key',
  type: 'object',
  properties: {
    key: {
      type: 'string',
      maxLength: 100
    },
    value: {
      type: 'string'
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['key', 'value']
};
