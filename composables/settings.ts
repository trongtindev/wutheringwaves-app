import { defineStore } from 'pinia';

export const useSettings = defineStore('useSettings', () => {
  // uses
  const database = useDatabase();

  // functions
  const get = async (
    key: string,
    defaultValue: any,
    options?: {
      upsert?: boolean;
    }
  ) => {
    options ??= {};

    const result = await database
      .getInstance()
      .settings.findOne({
        selector: {
          key
        }
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

  const set = async (key: string, value: any) => {
    return await database.getInstance().settings.upsert({
      key,
      value: JSON.stringify(value)
    });
  };

  return { get, set };
});
