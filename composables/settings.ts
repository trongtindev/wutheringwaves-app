import { defineStore } from 'pinia';

export const useSettings = defineStore('useSettings', () => {
  // uses
  const database = useDatabase();

  // functions
  const get = async (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: any,
    options?: {
      upsert?: boolean;
    },
  ) => {
    options ??= {};

    const db = await database.getInstance();
    const result = await db.settings
      .findOne({
        selector: {
          key,
        },
      })
      .exec();

    if (result) {
      return JSON.parse(result.value);
    }

    if (options.upsert) {
      await set(key, defaultValue);
    }
    return defaultValue;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = async (key: string, value: any) => {
    const db = await database.getInstance();
    return db.settings.upsert({
      key,
      value: JSON.stringify(value),
    });
  };

  return { get, set };
});
