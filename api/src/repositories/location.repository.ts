import {DefaultCrudRepository, HasManyRepositoryFactory, repository, RepositoryBindings} from '@loopback/repository';
import {Location} from '../graphql-types/location/location-type';
import {ConferenceDatasource} from '../datasources';
import {
  bind,
  BindingScope,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
  Getter
} from '@loopback/core';
import {Event} from "../graphql-types/event/event-type";
import {EventRepository} from "./event.repository";
import {LocationInput} from "../graphql-types/location/location-input";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class LocationRepository
  extends DefaultCrudRepository<Location, typeof Location.prototype.id>
  implements LifeCycleObserver {
  public readonly events: HasManyRepositoryFactory<
      Event,
      typeof Location.prototype.id
      >;
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      @repository.getter('EventRepository')
          eventRepositoryGetter: Getter<EventRepository>,
  ) {
    super(Location, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor(
        'events',
        eventRepositoryGetter,
    );
  }

  @inject('location')
  private sampleLocation: Location[];

  async start() {
    /*await this.createAll(this.sampleLocation);*/
  }

  stop() {}

  async getAll() {
    return this.find();
  }

  async getOne(id: string) {
    return this.findById(id);
  }

  async createLocation(location: LocationInput) {
    return this.create(location);
  }
}
