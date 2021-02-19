import {AuthenticationComponent} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {MetricsComponent} from '@loopback/extension-metrics';
import path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {LoggingBindings, LoggingComponent, WinstonLoggerOptions, format} from "@loopback/extension-logging";
import {DataSourceMixin} from "./datasources/mixins";
import {SeedService} from "./services";
import {GraphQLBindings, GraphQLComponent} from "@loopback/graphql";

export {ApplicationConfig};

export class ApiApplication extends DataSourceMixin(BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
)) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config();
    dotenvExt.load({
      schema: '.env',
      errorOnMissing: true,
    });

    this.component(AuthenticationComponent);
    // Register GraphQL module
    this.component(GraphQLComponent);
    // Register Metrics module
    this.component(MetricsComponent);

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
      asMiddlewareOnly: true,
    });

    // Bind context to resolver classes so we can use header to check for auth
    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to((context: any) => {
      return {...context};
    });

    // Bind service class to main app
    this.service(SeedService);

    // Configure and add logging component
    this.addLoggingComponent();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      graphqlResolvers: {
        // Customize ControllerBooter Conventions here
        dirs: ['graphql-resolvers'],
        extensions: ['.js'],
        nested: true,
      },
    };
  }

  private addLoggingComponent() {
    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: true,
    });

    this.configure<WinstonLoggerOptions>(LoggingBindings.WINSTON_LOGGER).to({
      // Only show warnings or higher when running tests
      level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
      format:
          process.env.NODE_ENV === 'development'
              ? format.combine(format.colorize(), format.simple())
              : format.combine(format.errors({stack: true}), format.json()),
      defaultMeta: {
        serviceContext: {
          service: 'api',
          version: '1.0.0',
          resourceType: 'api',
        },
      },
    });

    this.component(LoggingComponent);
  }
}
