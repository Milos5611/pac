import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {EventInput} from '../graphql-types/event/event-input';
import {Event} from '../graphql-types/event/event-type';
import {EventRepository} from '../repositories';

@resolver(of => Event)
export class EventResolver {
  constructor(
    @repository('EventRepository')
    private readonly eventsRepo: EventRepository
  ) {}

  @query(returns => Event, {nullable: true})
  async event(@arg('eventId') eventId: string) {
    return this.eventsRepo.getOne(eventId);
  }

  @query(returns => [Event])
  async events(): Promise<Event[]> {
    return this.eventsRepo.getAll();
  }

  @mutation(returns => Event)
  async createEvent(
      @arg('event') event: EventInput,
  ): Promise<Event> {
    return this.eventsRepo.createEvent(event);
  }

  @mutation(returns => Event)
  async updateEvent(@arg('id') id: string,  @arg('event') event: EventInput): Promise<Event> {
    return this.eventsRepo.updateEvent(id, event);
  }
}
