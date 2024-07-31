export default defineNuxtPlugin(async () => {
  const device = useDevice();
  if (device.isCrawler) {
    console.log('rxdbPlugin', 'ignore', 'isCrawler');
    return;
  }
  console.log('rxdbPlugin');

  const { addRxPlugin } = await import('rxdb');
  const { RxDBJsonDumpPlugin } = await import('rxdb/plugins/json-dump');
  const { RxDBQueryBuilderPlugin } = await import('rxdb/plugins/query-builder');
  const { RxDBMigrationPlugin } = await import('rxdb/plugins/migration-schema');
  const { RxDBUpdatePlugin } = await import('rxdb/plugins/update');

  if (import.meta.dev) {
    await import('rxdb/plugins/dev-mode').then((module) => {
      module.disableWarnings();
      addRxPlugin(module.RxDBDevModePlugin);
    });
  }

  // adding plugins
  addRxPlugin(RxDBJsonDumpPlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBMigrationPlugin);
  addRxPlugin(RxDBUpdatePlugin);
});
