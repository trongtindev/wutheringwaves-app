import { Collection } from '~/database/collection';

export class AccountDocument {
  name?: string;
  playerId: string;
  serverId: string;
  conveneHistoryUrl?: string;
  autoImport?: boolean;
  lastImport?: number;
  createdAt: number;

  constructor(args: Partial<AccountDocument>) {
    this.name = args.name;
    this.playerId = args.playerId || 'undefined';
    this.serverId = args.serverId || 'undefined';
    this.conveneHistoryUrl = args.conveneHistoryUrl;
    this.autoImport = args.autoImport;
    this.lastImport = args.lastImport;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class CharacterDocument {
  playerId: string;
  resourceId: number;
  sequences: number;
  obtainedAt: number;
  createdAt: number;

  constructor(args: Partial<CharacterDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.resourceId = args.resourceId || 0;
    this.sequences = args.sequences || 0;
    this.obtainedAt = args.obtainedAt || 0;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class ConveneDocument {
  playerId: string;
  name: string;
  time: string;
  qualityLevel: number;
  cardPoolType: number;
  resourceId: number;
  resourceType: string;
  pity: number;
  createdAt: number;

  constructor(args: Partial<ConveneDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.name = args.name || 'undefined';
    this.time = args.time || 'undefined';
    this.cardPoolType = args.cardPoolType || -1;
    this.qualityLevel = args.qualityLevel || -1;
    this.resourceId = args.resourceId || -1;
    this.resourceType = args.resourceType || 'undefined';
    this.pity = args.pity || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class MapPinDocument {
  playerId?: string;
  name: string;
  type: string;
  latLng: number[];
  createdAt: number;

  constructor(args: Partial<MapPinDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.name = args.name || 'undefined';
    this.type = args.type || 'undefined';
    this.latLng = args.latLng || [0, 0];
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class MapMarkedDocument {
  playerId?: string;
  pinId: number;
  createdAt: number;

  constructor(args: Partial<MapMarkedDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.pinId = args.pinId || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class SettingDocument {
  playerId?: string;
  key: string;
  value: string;
  createdAt: number;

  constructor(args: Partial<SettingDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.key = args.key || 'undefined';
    this.value = args.value || 'undefined';
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class AchievementDocument {
  playerId: string;
  slug: string;
  createdAt: number;

  constructor(args: Partial<AchievementDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.slug = args.slug || 'undefined';
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export class WeaponDocument {
  playerId: string;
  count: number;
  resourceId: number;
  createdAt: number;

  constructor(args: Partial<WeaponDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.count = args.count || -1;
    this.resourceId = args.resourceId || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}

export type Collections = {
  accounts: Collection<AccountDocument>;
  characters: Collection<CharacterDocument>;
  convenes: Collection<ConveneDocument>;
  mapPins: Collection<MapPinDocument>;
  mapMarked: Collection<MapMarkedDocument>;
  settings: Collection<SettingDocument>;
  achievements: Collection<AchievementDocument>;
  weapons: Collection<WeaponDocument>;
};

export const useDatabase = defineStore('useDatabase', () => {
  const collections: Collections = {
    accounts: new Collection<AccountDocument>(
      AccountDocument,
      () => (onChanged.value = randomId()),
    ),
    characters: new Collection<CharacterDocument>(
      CharacterDocument,
      () => (onChanged.value = randomId()),
    ),
    convenes: new Collection<ConveneDocument>(
      ConveneDocument,
      () => (onChanged.value = randomId()),
    ),
    mapPins: new Collection<MapPinDocument>(
      MapPinDocument,
      () => (onChanged.value = randomId()),
    ),
    mapMarked: new Collection<MapMarkedDocument>(
      MapMarkedDocument,
      () => (onChanged.value = randomId()),
    ),
    settings: new Collection<SettingDocument>(
      SettingDocument,
      () => (onChanged.value = randomId()),
    ),
    achievements: new Collection<AchievementDocument>(
      AchievementDocument,
      () => (onChanged.value = randomId()),
    ),
    weapons: new Collection<WeaponDocument>(
      WeaponDocument,
      () => (onChanged.value = randomId()),
    ),
  };

  // states
  const onChanged = ref<string>();
  const isInitialized = ref(false);

  // functions
  const initialize = () => {
    try {
      importJson(localStorage.getItem('collections') || '[]');
      isInitialized.value = true;
    } catch (error) {
      alert(error);
    }
  };

  const importJson = (data: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: { [key: string]: any[] } = JSON.parse(data);

    collections.accounts.fromJson(json.accounts ?? []);
    collections.characters.fromJson(json.characters ?? []);
    collections.convenes.fromJson(json.convenes ?? []);
    collections.mapPins.fromJson(json.mapPins ?? []);
    collections.mapMarked.fromJson(json.mapMarked ?? []);
    collections.settings.fromJson(json.settings ?? []);
    collections.achievements.fromJson(json.achievements ?? []);
    collections.weapons.fromJson(json.weapons ?? []);

    if (isInitialized.value) {
      onChanged.value = randomId();
    }
  };

  const exportJson = (): string => {
    return JSON.stringify(
      Object.fromEntries(
        Object.keys(collections)
          .map((key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const collection = collections[key] as Collection<any>;
            return { key, docs: collection.toObject() };
          })
          .map((e) => [e.key, e.docs]),
      ),
    );
  };

  const save = () => {
    const json = exportJson();
    localStorage.setItem('collections', json);
  };

  const saveDebounce = useDebounceFn(() => save(), 500);

  const eraseAllData = async () => {
    Object.keys(collections).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const collection = collections[key] as Collection<any>;
      collection.erase();
    });
  };

  // changes
  watch(() => onChanged.value, saveDebounce);

  // lifecycle
  onBeforeMount(() => initialize());

  return {
    ...collections,
    importJson,
    exportJson,
    save,
    eraseAllData,
    onChanged,
  };
});
