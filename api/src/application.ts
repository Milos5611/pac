import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
import {
  format,
  LoggingBindings,
  LoggingComponent,
  WinstonLoggerOptions,
} from '@loopback/logging';
import {MetricsComponent} from '@loopback/metrics';
import {RepositoryMixin} from '@loopback/repository';
import {Request, Response, RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DataSourceMixin} from './datasources/mixins';
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
      apollo: {introspection: true},
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

    this.component(MetricsComponent);

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
