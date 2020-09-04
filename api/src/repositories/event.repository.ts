import {BelongsToAccessor, DefaultCrudRepository, Filter, repository, RepositoryBindings} from '@loopback/repository';
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
import {plainToClass} from "class-transformer";
import {EventInput} from "../graphql-types/event/event-input";
import {v4 as uuidv4} from 'uuid'
import {Location} from "../graphql-types/location/location-type";
import {LocationRepository} from "./location.repository";
import {IFilter} from "../graphql-resolvers/event-resolver";
import {EventFilter} from "../graphql-types/event/event-filter";

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

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      @repository.getter('LocationRepository') locationRepository: Getter<LocationRepository>
      ) {
    super(Event, dataSource);

    this.location = this.createBelongsToAccessorFor(
        "location",
        locationRepository
    );
    this.registerInclusionResolver("location", this.location.inclusionResolver);

  }

  async start() {}

  stop() {}

  async getAll(filter?: EventFilter) {
    return this.find({
      ...filter && {
        where: {
          ...filter
        },
      },
      include: [{
        relation: "location",
        scope: {
          include: [{
            relation: 'rooms',
            scope: {
              include: [{
                relation: 'talks',
                scope: {
                  include: [{relation: 'topics'}],
                },
              }],
            },
          }],
        },
      }]
    });
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createEvent(eventData: EventInput) {
    const newEvent = Object.assign(eventData, {id: uuidv4()});
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
