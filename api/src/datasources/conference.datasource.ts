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
  url: '',
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ?? 5432,
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_DATABASE ?? "postgres"
};

@lifeCycleObserver('datasource', {
  tags: {
    [ContextTags.NAME]: 'conference',
    [ContextTags.NAMESPACE]: RepositoryBindings.DATASOURCES,
  },
})
export class ConferenceDatasource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'conference';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.conference', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    console.log(config);
    // Add logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
