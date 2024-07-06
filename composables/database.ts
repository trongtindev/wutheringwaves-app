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
import type { RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
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
import {
  trophyCollectionMethods,
  trophyDocMethods,
  trophySchema,
  type TrophyCollection
} from '~/collections/trophy';

export type DatabaseCollections = {
  convenes: ConveneCollection;
  settings: SettingCollection;
  accounts: AccountCollection;
  markers: MarkerCollection;
  characters: CharacterCollection;
  trophies: TrophyCollection;
};
export type MyDatabase = RxDatabase<DatabaseCollections>;

export const useDatabase = defineStore('useDatabase', () => {
  let db: MyDatabase;

  // uses
  const i18n = useI18n();
  const onChangedDebounce = useDebounceFn(() => {
    isChanged.value = randomId();
  }, 500);

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
    const { createRxDatabase } = await import('rxdb');

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

          console.log('database', 'addCollections');
          const collections = await db.addCollections({
            convenes: {
              schema: conveneSchema,
              methods: conveneDocMethods,
              statics: conveneCollectionMethods,
              autoMigrate: false,
              migrationStrategies: {
                1: function (oldDoc) {
                  oldDoc._id = randomId();
                  oldDoc.key = undefined;
                  oldDoc.resourceId = undefined;
                  return oldDoc;
                },
                2: function (oldDoc) {
                  oldDoc.pity = 0;
                  return oldDoc;
                },
                3: function (oldDoc) {
                  oldDoc.win = false;
                  return oldDoc;
                },
                4: function (oldDoc) {
                  if (oldDoc.resourceType === 'Resonators') {
                    // Kuro has change Resonators => Resonator
                    oldDoc.resourceType = 'Resonator';
                  } else if (oldDoc.resourceType === 'Weapons') {
                    // Kuro has change Weapons => Weapon
                    oldDoc.resourceType = 'Weapon';
                  }
                  return oldDoc;
                }
              }
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
                1: function (oldDoc) {
                  oldDoc.serverId = '86d52186155b148b5c138ceb41be9650';
                  return oldDoc;
                }
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
            },
            trophies: {
              schema: trophySchema,
              methods: trophyDocMethods,
              statics: trophyCollectionMethods,
              autoMigrate: false
            }
          });

          // check migration
          console.log('database', 'check migration');
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
          db.convenes.postInsert(() => onChangedDebounce(), false);
          db.convenes.postSave(() => onChangedDebounce(), false);
          // db.convenes.postRemove(() => onChangedDebounce(), false);

          // settings
          db.settings.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.settings.postInsert(() => onChangedDebounce(), false);
          db.settings.postSave(() => onChangedDebounce(), false);
          db.settings.postRemove(() => onChangedDebounce(), false);

          // accounts
          db.accounts.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.accounts.postInsert(() => onChangedDebounce(), false);
          db.accounts.postSave(() => onChangedDebounce(), false);
          // db.accounts.postRemove(() => onChangedDebounce(), false);

          // map
          db.markers.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.markers.postInsert(() => onChangedDebounce(), false);
          db.markers.postSave(() => onChangedDebounce(), false);
          db.markers.postRemove(() => onChangedDebounce(), false);

          // character
          db.characters.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.characters.postInsert(() => onChangedDebounce(), false);
          db.characters.postSave(() => onChangedDebounce(), false);
          // db.characters.postRemove(() => onChangedDebounce(), false);

          // trophies
          db.trophies.preInsert((plainData) => {
            plainData.createdAt ??= new Date().getTime();
          }, false);
          db.trophies.postInsert(() => onChangedDebounce(), false);
          db.trophies.postSave(() => onChangedDebounce(), false);
          db.trophies.postRemove(() => onChangedDebounce(), false);

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

  return {
    state,
    isInitialized,
    isChanged,
    initialize,
    getInstance,
    eraseAllData
  };
});
