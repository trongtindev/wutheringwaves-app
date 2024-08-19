import { Collection } from '~/database/collection';
import { AccountDocument } from '~/database/documents/account';
import { AchievementDocument } from '~/database/documents/achievement';
import { CharacterDocument } from '~/database/documents/character';
import { ConveneDocument } from '~/database/documents/convene';
import { MapMarkedDocument } from '~/database/documents/map_marked';
import { MapPinDocument } from '~/database/documents/map_pin';
import { SettingDocument } from '~/database/documents/settings';
import { WeaponDocument } from '~/database/documents/weapon';

type Collections = {
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
