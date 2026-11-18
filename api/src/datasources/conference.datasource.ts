import {
  ContextTags,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler, RepositoryBindings} from '@loopback/repository';

const config = {
  name: 'conference_db',
  connector: 'postgresql',
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'postgres',
  // Passed through to pg.Pool: cap connections, and fail instead of hanging
  // when the database is unreachable or a query runs away
  max: +(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: +(process.env.DB_STATEMENT_TIMEOUT_MS ?? 15_000),
  // Client-side limit for when the server itself stops responding
  query_timeout: +(process.env.DB_STATEMENT_TIMEOUT_MS ?? 15_000) + 5_000,
};

@lifeCycleObserver('datasource', {
  tags: {
    [ContextTags.NAME]: 'conference',
    [ContextTags.NAMESPACE]: RepositoryBindings.DATASOURCES,
  },
})
export class ConferenceDatasource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'conference';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.conference', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  start(): ValueOrPromise<void> {}

  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
