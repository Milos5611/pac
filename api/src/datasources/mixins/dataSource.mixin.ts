import {SchemaMigrationOptions, Class, juggler} from '@loopback/repository';
import fs from 'fs';
import path from 'path';
import {ConferenceDatasource} from '..';
import {MigrationRepository} from '../../repositories';
import {LoggingBindings} from '@loopback/extension-logging';

// Explicitly define tables in the order they should be created
// so we don't receive "relation does not exist" errors
// https://github.com/strongloop/loopback-connector/issues/168
const PUBLIC_MODELS: string[] = [
  'Location', 'Event', 'Room', 'Talk', 'Organization', 'Person', 'Topic', 'Children', 'Parent', 'TopicChildren', 'TopicParent'
];

export enum MIGRATION_TYPES {
  PUBLIC = 'public',
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataSourceMixin<T extends Class<any>>(superClass: T) {
  return class extends superClass {

    async migratePublicSchema(options?: SchemaMigrationOptions) {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      const datasource: ConferenceDatasource = await this.get(
        'datasources.conference',
      );
      logger.info('Migrate public schema', options);

      for (const model of PUBLIC_MODELS) {
        logger.info(`Auto updating schema for model ${model}`);
        // Instantiate repository to ensure models are attached to their datasources
        await this.get(`repositories.${model}Repository`);
        // Migrate schema without destroying data
        await datasource.autoupdate(model);
      }
    }

    // Override default migrateSchema method to better handle foreign keys
    // and relations
    async migrateDataSources(options?: SchemaMigrationOptions) {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      logger.info(`Migrating data sources`, options);

      // Handle request to drop existing schema
      if (options?.existingSchema === 'drop') {
        await this.dropDataSources();
      }

      // Migrate public schema tables
      await this.migratePublicSchema(options);
      await this.migrateData(MIGRATION_TYPES.PUBLIC);
    }

    public async dropDataSources() {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      logger.info(`Dropping all data sources`);

      try {

        // Drop public data sources
        const datasource: ConferenceDatasource = await this.get(
          'datasources.conference',
        );
        await this.dropSchema(datasource, PUBLIC_MODELS);
      } catch (error) {
        console.log("Error in dropDataSources", error)
      }
    }

    async dropDataSource(schema: string) {
      // Method is used by tests to cleanup schemas previously created
      const dataSource = await this.get('datasources.conference');
      await dataSource.execute(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    }

    // Run custom data migrations
    async migrateData(migrationType: MIGRATION_TYPES, schema = 'public') {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      const migrationRepository = await this.getRepository(MigrationRepository);

      // Load all files from migration directory
      const pathToMigrations = path.resolve(
        __dirname,
        '..',
        '..',
        'migrations',
        migrationType,
      );

      const files = fs.readdirSync(pathToMigrations);
      logger.info(`Migrating data for ${migrationType} and schema ${schema}`);

      for (const file of files) {
        if (!file.endsWith('.js')) {
          continue;
        }

        const {run} = require(`${pathToMigrations}/${file}`);
        if (!run || !(run instanceof Function)) {
          throw new Error(`Migation ${file} missing run() export.`);
        }

        // Execute migration if it has not been run before
        const name = file.replace('.js', '');
        const migration = {name, schema};
        const hasRun = await migrationRepository.findOne({where: migration});

        if (!hasRun) {
          logger.info(
            `Schema ${migrationType} data migration #${name}: Executing`,
          );
          await run(this);
          await migrationRepository.create({
            ...migration,
            created_at: new Date(),
          });
        } else {
          logger.info(
            `Schema ${migrationType} data migration #${name}: Skipped`,
          );
        }
      }
    }

    // This function is needed when SchemaMigrationOptions.existingSchema = drop
    // Loopback 4 does not yet support referential actions such as onDelete: CASCADE.
    // https://github.com/strongloop/loopback-next/issues/2766
    async dropSchema(
      datasource: juggler.DataSource,
      models: string[],
      schema = 'public',
    ) {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      logger.info(`Dropping schema ${schema} for models`, models);

      for (const model of models) {
        await datasource.execute(
          `DROP TABLE IF EXISTS ${schema}.${model} CASCADE`,
        );
      }
    }
  };
}
