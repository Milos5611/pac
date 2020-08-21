import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {GraphQLBindings, GraphQLComponent} from '../graphql';
import {sampleLocation} from './sample-locations';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

export {ApplicationConfig};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
    });

    this.component(GraphQLComponent);
    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
      asMiddlewareOnly: true,
    });

    this.bind('location').to([...sampleLocation]);

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
