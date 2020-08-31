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
import {Room} from "../graphql-types/room/room-type";
import {RoomRepository} from "./room.repository";

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
  public readonly rooms: HasManyRepositoryFactory<
      Room,
      typeof Room.prototype.id
      >;
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      @repository.getter('EventRepository') eventRepositoryGetter: Getter<EventRepository>,
      @repository.getter('RoomRepository') roomRepositoryGetter: Getter<RoomRepository>
  ) {
    super(Location, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor(
        'events',
        eventRepositoryGetter,
    );
    this.rooms = this.createHasManyRepositoryFactoryFor(
        'rooms',
        roomRepositoryGetter,
    );

    this.registerInclusionResolver('events', this.events.inclusionResolver);
    this.registerInclusionResolver('rooms', this.rooms.inclusionResolver);
  }

  @inject('location')
  private sampleLocation: Location[];

  async start() {
    /*const locations = await this.find();
    if(locations.length === 0) {
      await this.createAll(this.sampleLocation);
    }*/
  }

  stop() {}

  async getAll() {
    return this.find({
      include: [{relation: "events"}]
    });
  }

  async getOne(id: string) {
    return  this.findOne({
      where: {id},
      include: [{relation: "events"}]
    });
  }

  async createLocation(location: LocationInput) {
    return this.create(location);
  }
}
