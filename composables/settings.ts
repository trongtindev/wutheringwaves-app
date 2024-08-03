export const useSettings = defineStore('useSettings', () => {
  // uses
  const database = useDatabase();

  // functions
  const get = (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: any,
    options?: {
      upsert?: boolean;
    },
  ) => {
    options ??= {};

    const [id, doc] = database.settings.findOne({ key });
    if (id) {
      return JSON.parse(doc.value);
    }
    if (options.upsert) set(key, defaultValue);

    return defaultValue;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = async (key: string, value: any) => {
    return database.settings.updateOne(
      {
        key,
      },
      {
        value: JSON.stringify(value),
      },
      {
        upsert: true,
      },
    );
  };

  return { get, set };
});
