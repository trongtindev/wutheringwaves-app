import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'; // need plugins/leader-election
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'; // depend on cleanup

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
  addRxPlugin(RxDBCleanupPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
});
