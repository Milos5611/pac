import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {EventFilter} from '../graphql-types/event/event-filter';
import {EventInput} from '../graphql-types/event/event-input';
import {Event} from '../graphql-types/event/event-type';
import {GraphQLContext} from '../helper';
import {EventRepository} from '../repositories';

@resolver(of => Event)
export class EventResolver {
  constructor(
    @repository('EventRepository')
    private readonly eventsRepo: EventRepository,
  ) {}

  @query(() => Event, {nullable: true})
  async event(@arg('eventId') eventId: string) {
    return this.eventsRepo.getOne(eventId);
  }

  @query(() => [Event])
  async events(@arg('filter', {nullable: true}) filter?: EventFilter) {
    return this.eventsRepo.getAll(filter);
  }

  @mutation(() => Event)
  async createEvent(
    @arg('event') event: EventInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Event> {
    await requireUser(context);
    return this.eventsRepo.createEvent(event);
  }

  @mutation(() => Event)
  async updateEvent(
    @arg('id') id: string,
    @arg('event') event: EventInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Event> {
    await requireUser(context);
    return this.eventsRepo.updateEvent(id, event);
  }

  @mutation(() => Boolean)
  async deleteEvent(
    @arg('id') id: string,
    @Ctx() context: GraphQLContext,
  ): Promise<boolean> {
    await requireUser(context);
    await this.eventsRepo.deleteEvent(id);
    return true;
  }
}
