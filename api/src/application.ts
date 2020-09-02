import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {MetricsComponent} from '@loopback/extension-metrics';
import path from 'path';
import {GraphQLBindings, GraphQLComponent} from '../module/graphql';
import {sampleLocation, sampleEvent, sampleOrganization, samplePerson, sampleTalk} from './seed-data';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {LoggingBindings, LoggingComponent, WinstonLoggerOptions, format} from "@loopback/extension-logging";
import {DataSourceMixin} from "./datasources/mixins";

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

    // Register GraphQL module
    this.component(GraphQLComponent);
    // Register Metrics module
    this.component(MetricsComponent);

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
      asMiddlewareOnly: true,
    });

    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to((context: any) => {
      return {...context};
    });

    this.bind('location').to([...sampleLocation]);
    this.bind('event').to([...sampleEvent]);
    this.bind('talk').to([...sampleTalk]);
    this.bind('organization').to([...sampleOrganization]);
    this.bind('person').to([...samplePerson]);

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

  /*async migrateSchema(options?: SchemaMigrationOptions) {
    // 1. Run migration scripts provided by connectors
    await super.migrateSchema(options);

    // 2. Make further changes. When creating predefined model instances,
    // handle the case when these instances already exist.
    const eventsRepo = await this.getRepository(EventsRepository);
    const found = await eventsRepo.findOne({where: {id: 8}});
    if (found) {
      eventsRepo.updateById(found.id, {eventName: "Milos"});
    } else {
      // @ts-ignore
      await eventsRepo.create(...events);
    }
  }*/
}
