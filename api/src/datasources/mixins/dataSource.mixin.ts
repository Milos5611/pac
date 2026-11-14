import {LoggingBindings} from '@loopback/logging';
import {Class, juggler, SchemaMigrationOptions} from '@loopback/repository';
import {ConferenceDatasource} from '../conference.datasource';

// Tables in the order they must be created, so foreign keys never point at a
// table that does not exist yet ("relation does not exist").
// https://github.com/strongloop/loopback-connector/issues/168
export const PUBLIC_MODELS: string[] = [
  'Location',
  'Event',
  'Room',
  'Talk',
  'Organization',
  'Person',
  'Topic',
  'Children',
  'Parent',
];

export function DataSourceMixin<T extends Class<any>>(superClass: T) {
  return class extends superClass {
    async migratePublicSchema(options?: SchemaMigrationOptions) {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      const datasource: ConferenceDatasource = await this.get(
        'datasources.conference',
      );
      logger.info('Migrate public schema');

      for (const model of PUBLIC_MODELS) {
        logger.debug(`Auto updating schema for model ${model}`);
        // Resolve the repository so the model is attached to the datasource
        await this.get(`repositories.${model}Repository`);
        await datasource.autoupdate(model);
      }
    }

    // Replaces the default migrateSchema to create tables in FK order
    async migrateDataSources(options?: SchemaMigrationOptions) {
      if (options?.existingSchema === 'drop') {
        await this.dropDataSources();
      }
      await this.migratePublicSchema(options);
    }

    async dropDataSources() {
      const datasource: ConferenceDatasource = await this.get(
        'datasources.conference',
      );
      await this.dropSchema(datasource, [...PUBLIC_MODELS].reverse());
    }

    // LoopBack does not support referential actions such as ON DELETE
    // CASCADE, so tables are dropped with CASCADE explicitly.
    // https://github.com/strongloop/loopback-next/issues/2766
    async dropSchema(
      datasource: juggler.DataSource,
      models: string[],
      schema = 'public',
    ) {
      const logger = await this.get(LoggingBindings.WINSTON_LOGGER);
      logger.info(`Dropping tables in schema ${schema}: ${models.join(', ')}`);

      if (datasource.connector?.name !== 'postgresql') return;
      for (const model of models) {
        await datasource.execute(
          `DROP TABLE IF EXISTS ${schema}.${model.toLowerCase()} CASCADE`,
        );
      }
    }
  };
}
