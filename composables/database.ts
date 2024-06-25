import {
  accountCollectionMethods,
  accountDocMethods,
  accountSchema,
  type AccountCollection
} from '@/collections/account';
import {
  conveneCollectionMethods,
  conveneDocMethods,
  conveneSchema,
  type ConveneCollection
} from '@/collections/convene';
import {
  settingCollectionMethods,
  settingDocMethods,
  settingSchema,
  type SettingCollection
} from '@/collections/setting';
import { defineStore } from 'pinia';
import { createRxDatabase, type RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { createId } from '@paralleldrive/cuid2';
import {
  markerSchema,
  markerDocMethods,
  markerCollectionMethods,
  type MarkerCollection
} from '~/collections/marker';
import {
  characterCollectionMethods,
  characterDocMethods,
  characterSchema,
  type CharacterCollection
} from '~/collections/character';

export type DatabaseCollections = {
  convenes: ConveneCollection;
  settings: SettingCollection;
  accounts: AccountCollection;
  markers: MarkerCollection;
  characters: CharacterCollection;
};
export type MyDatabase = RxDatabase<DatabaseCollections>;

export const useDatabase = defineStore('useDatabase', () => {
  let db: MyDatabase;
  let emitChanged: any;

  // uses
  const i18n = useI18n();

  // states
  const state = ref<'' | 'initializing' | 'migration'>('');
  const isChanged = ref();
  const isInitialized = ref(false);

  // functions
  const initialize = async (options?: { override?: boolean }) => {
    console.log('database', 'initialize');
    options ??= {};

    if (import.meta.server) {
      throw new Error('Cannot initialize database on server side!');
    }

    if (!options.override) {
      if (db || state.value != '') {
        return;
      }
    }

    state.value = 'initializing';
    return new Promise((resolve, reject) => {
      // LINK: https://rxdb.info/migration-schema.html
      createRxDatabase<DatabaseCollections>({
        name: 'default',
        storage: getRxStorageDexie(),
        multiInstance: false,
        cleanupPolicy: {
          minimumDeletedTime: 1000 * 60 * 60 * 24 * 7
        }
      })
        .then(async (result) => {
          db = result;

          const collections = await db.addCollections({
            convenes: {
              schema: conveneSchema,
              methods: conveneDocMethods,
              statics: conveneCollectionMethods,
              autoMigrate: false,
              migrationStrategies: {}
            },
            settings: {
              schema: settingSchema,
              methods: settingDocMethods,
              statics: settingCollectionMethods,
              autoMigrate: false
            },
            accounts: {
              schema: accountSchema,
              methods: accountDocMethods,
              statics: accountCollectionMethods,
              autoMigrate: false,
              migrationStrategies: {
                // // 1 means, this transforms data from version 0 to version 1
                // 1: function (oldDoc) {
                //   oldDoc.newColumn = ''; // set default value new column
                //   return oldDoc;
                // },
              }
            },
            markers: {
              schema: markerSchema,
              methods: markerDocMethods,
              statics: markerCollectionMethods,
              autoMigrate: false
            },
            characters: {
              schema: characterSchema,
              methods: characterDocMethods,
              statics: characterCollectionMethods,
              autoMigrate: false
            }
          });

          // check migration
          for (const collection of Object.keys(collections)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (await (collections as any)[collection].migrationNeeded()) {
              state.value = 'migration';
              console.info('database', collection, 'startMigration');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (collections as any)[collection].startMigration();
              console.info('database', collection, 'startMigration', 'done');
            }
          }
          if (state.value === 'migration') state.value = '';

          // convenes
          db.convenes.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.convenes.postInsert(() => onChanged(), false);

          // settings
          db.settings.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.settings.postInsert(() => onChanged(), false);

          // accounts
          db.accounts.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.accounts.postInsert(() => onChanged(), false);

          // map
          db.markers.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.markers.postInsert(() => onChanged(), false);

          // character
          db.characters.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.characters.postInsert(() => onChanged(), false);

          state.value = '';
          isInitialized.value = true;

          resolve(db);
        })
        .catch(async (error) => {
          console.error(error);

          if (import.meta.dev) {
            alert(error);
          } else {
            // TODO: native confirm
            if (confirm(i18n.t('Data is corrupted, all data will be erase?'))) {
              await eraseAllData();
              window.location.reload();
            }
          }

          reject(error);
        })
        .finally(() => {
          state.value = '';
        });
    });
  };

  const getInstance = async () => {
    while (!db || !isInitialized.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return db;
  };

  const eraseAllData = async () => {
    console.warn('eraseAllData', await db.remove());
    console.warn('eraseAllData', await db.destroy());
  };

  // events
  const onChanged = (emit?: boolean) => {
    if (emit) {
      console.log('database', 'onChanged');
      isChanged.value = createId();
    } else {
      if (emitChanged) clearTimeout(emitChanged);
      emitChanged = setTimeout(() => onChanged(true), 250);
    }
  };

  return {
    state,
    isInitialized,
    isChanged,
    initialize,
    getInstance,
    eraseAllData
  };
});
