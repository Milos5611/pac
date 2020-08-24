import {DefaultCrudRepository, repository, RepositoryBindings} from '@loopback/repository';
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

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class EventRepository
  extends DefaultCrudRepository<Event, typeof Event.prototype.id>
  implements LifeCycleObserver {
  @repository.getter('LocationRepository') getLocationRepository: Getter<LocationRepository>;
  constructor(@inject('datasources.conference') dataSource: ConferenceDatasource) {
    super(Event, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }

  async getOne(id: string) {
    const event = await this.findById(id);
    const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(event.location_id);
    return {
      id: event.id,
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date,
      event_location: name
    };
  }

  async createEvent(eventData: EventInput) {
    const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(eventData.location_id);
    const event = this.createEventClass(eventData, name);
    return this.create(event);
  }

  async updateEvent(id: string, eventData: EventInput) {
    const foundEvent = await this.findById(id);
    if(!foundEvent) throw new Error("Event doesn't exist");
    await this.updateById(id, eventData);
    return this.findById(id);
  }

  private createEventClass(eventData: Partial<Event>, name: string): Event {
    const event = plainToClass(Event, eventData);
    event.event_location = name;
    return event;
  }
}
