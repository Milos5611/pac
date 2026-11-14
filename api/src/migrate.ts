import {LoggingBindings} from '@loopback/logging';
import {ApiApplication} from './application';

export async function migrate(args: string[]) {
  const app = new ApiApplication();
  await app.boot();

  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  logger.info(`Migrating schemas (${existingSchema} existing schema)`);

  await app.migrateDataSources({
    existingSchema,
  });

  // Connectors keep a pool of open connections, which keeps the process
  // alive after the work is done. Exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
