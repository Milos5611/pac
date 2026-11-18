import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
import {HealthComponent, HealthTags} from '@loopback/health';
import {
  format,
  LoggingBindings,
  LoggingComponent,
  WinstonLoggerOptions,
} from '@loopback/logging';
import {MetricsComponent} from '@loopback/metrics';
import {juggler, RepositoryMixin} from '@loopback/repository';
import {Request, Response, RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DataSourceMixin} from './datasources/mixins';
import {createErrorFormatter} from './graphql-server/format-error';
import {queryLimitsRule} from './graphql-server/query-limits';
import {SeedService} from './services';

export {ApplicationConfig};

export class ApiApplication extends DataSourceMixin(
  BootMixin(ServiceMixin(RepositoryMixin(RestApplication))),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // GraphQL runs as Express middleware inside the REST server at /graphql.
    // It must be configured before the server binding is resolved.
    this.component(GraphQLComponent);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
      asMiddlewareOnly: true,
      graphQLPath: '/graphql',
      // The GraphQL WebSocket server accepts upgrades on every path otherwise
      path: '/graphql',
      // Runs the class-validator rules declared on input types
      validate: true,
      apollo: {
        introspection: true,
        includeStacktraceInErrorResponses: false,
        formatError: createErrorFormatter(message => this.logError(message)),
        validationRules: [queryLimitsRule()],
      },
    });
    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    // body-parser 2 leaves req.body undefined for bodiless requests (GET),
    // which Apollo rejects. Default it so GET /graphql (sandbox, GET queries)
    // works; POST bodies are still parsed over it.
    this.expressMiddleware(
      'middleware.express.GraphQLBodyDefault',
      (req: Request, _res: Response, next: () => void) => {
        if (req.path.startsWith('/graphql') && req.body === undefined) {
          req.body = {};
        }
        next();
      },
    );
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(async context => ({
      ...context,
    }));

    // Prometheus metrics at /metrics, opt-in because the endpoint is public
    if (process.env.METRICS_ENABLED === 'true') {
      this.component(MetricsComponent);
    }

    // /live answers while the process runs; /ready also needs the database
    this.component(HealthComponent);
    this.bind('health.checks.database')
      .to(async () => {
        const db = await this.get<juggler.DataSource>('datasources.conference');
        // A database that accepts connections but never answers would
        // otherwise hold the probe open
        let timer: NodeJS.Timeout | undefined;
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('database did not answer within 3 s')),
            3000,
          );
        });
        await Promise.race([db.ping(), timeout]).finally(() =>
          clearTimeout(timer),
        );
      })
      .tag(HealthTags.READY_CHECK);

    this.service(SeedService);

    this.addLoggingComponent();

    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    this.bootOptions = {
      graphqlResolvers: {
        dirs: ['graphql-resolvers'],
        extensions: ['.js'],
        nested: true,
      },
    };
  }

  private logError(message: string) {
    this.get(LoggingBindings.WINSTON_LOGGER).then(
      logger => logger.error(message),
      () => console.error(message),
    );
  }

  private addLoggingComponent() {
    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: process.env.NODE_ENV !== 'test',
    });

    this.configure<WinstonLoggerOptions>(LoggingBindings.WINSTON_LOGGER).to({
      level:
        process.env.LOG_LEVEL ??
        (process.env.NODE_ENV === 'test' ? 'error' : 'info'),
      format:
        process.env.NODE_ENV === 'production'
          ? format.combine(format.errors({stack: true}), format.json())
          : format.combine(format.colorize(), format.simple()),
      defaultMeta: {
        serviceContext: {
          service: 'api',
          version: '2.0.0',
          resourceType: 'api',
        },
      },
    });

    this.component(LoggingComponent);
  }
}
