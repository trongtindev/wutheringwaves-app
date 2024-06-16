import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

export default defineNuxtPlugin(async () => {
  if (import.meta.dev) {
    await import('rxdb/plugins/dev-mode').then((module) => {
      module.disableWarnings();
      addRxPlugin(module.RxDBDevModePlugin);
    });
  }

  addRxPlugin(RxDBJsonDumpPlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBMigrationPlugin);
  addRxPlugin(RxDBUpdatePlugin);
});
