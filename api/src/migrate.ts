import {ApiApplication} from './application';
import {LoggingBindings} from "@loopback/extension-logging";

export async function migrate(args: string[]) {
  const app = new ApiApplication();
  await app.boot();

  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  logger.info(`Migrating schemas (${existingSchema} existing schema)`);
  await app.migrateSchema({existingSchema});

  /*await app.migrateSchema({
    existingSchema,
    models: ['Location', 'Event', 'Language', 'Organization', 'Room', 'Person' ],
  });*/

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
