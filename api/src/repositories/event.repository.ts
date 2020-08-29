import {BelongsToAccessor, DefaultCrudRepository, repository, RepositoryBindings} from '@loopback/repository';
import {Event} from '../graphql-types/event/event-type';
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
import {LocationRepository} from "./location.repository";
import {plainToClass} from "class-transformer";
import {EventInput} from "../graphql-types/event/event-input";
import {v4 as uuidv4} from 'uuid'
import {Location} from "../graphql-types/location/location-type";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class EventRepository
  extends DefaultCrudRepository<Event, typeof Event.prototype.id> implements LifeCycleObserver {

  public readonly location: BelongsToAccessor<Location, typeof Event.prototype.id>;

  @repository.getter('EventRepository') getLocationRepository: Getter<LocationRepository>
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      ) {
    super(Event, dataSource);

    this.location = this.createBelongsToAccessorFor(
        "location",
        this.getLocationRepository
    );
    this.registerInclusionResolver("location", this.location.inclusionResolver);

  }

  async start() {}

  stop() {}

  async getAll() {
    return this.execute( `
      SELECT event.id, event.name, event.start_date, event.end_date, event.location_id, location.name as location_name
      FROM event
      INNER JOIN location on event.location_id = location.id
  `);
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createEvent(eventData: EventInput) {
    const newEvent = Object.assign(eventData, {id: uuidv4()});
    /*const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(eventData.locationId);*/

    const event = plainToClass(Event, newEvent);

    return this.create(event);
  }

  async updateEvent(id: string, eventData: EventInput) {
    const foundEvent = await this.findById(id);
    if(!foundEvent) throw new Error("Event doesn't exist");
    await this.updateById(id, eventData);
    return this.findById(id);
  }
}
