import {repository} from '@loopback/repository';
import {EventInput} from '../graphql-types/event/event-input';
import {Event} from '../graphql-types/event/event-type';
import {EventRepository} from '../repositories';
import {inject} from "@loopback/core";
import {ContextTypes} from "../helper";
import {EventFilter} from "../graphql-types/event/event-filter";
import {arg, Ctx, GraphQLBindings, mutation, query, resolver, ResolverData} from '@loopback/graphql';
import SSOOktaStrategy from "../authentication-strategies/sso.okta.strategy";
import * as Events from 'events';

export interface IFilter {
  start_date: string
}

@resolver(of => Event)
export class EventResolver {
  constructor(
    @repository('EventRepository')
    private readonly eventsRepo: EventRepository,
    // It's possible to inject the resolver data
    @inject(GraphQLBindings.RESOLVER_DATA) private resolverData: ResolverData,
  ) {}

  @query(() => Event, {nullable: true})
  async event(@arg('eventId') eventId: string) {
    return this.eventsRepo.getOne(eventId);
  }

  @query(() => [Event])
  async events(
      @arg('filter', {nullable: true}) filter?: EventFilter
  ) {
    return this.eventsRepo.getAll(filter);
  }

  @mutation(() => Event)
  async createEvent(
      @arg('event') event: EventInput,
      @Ctx() context: ContextTypes
  ): Promise<Event | Error> {
    const user = await SSOOktaStrategy.authenticate(context.req);
    if(user) {
      return this.eventsRepo.createEvent(event);
    } else {
      return new Error("You must be logged in to do this action");
    }
  }

  @mutation(() => Event)
  async updateEvent(@arg('id') id: string,  @arg('event') event: EventInput): Promise<Event> {
    return this.eventsRepo.updateEvent(id, event);
  }

  @mutation(() => Event, {nullable: true})
  async deleteEvent(@arg('id') id: string) {
    return this.eventsRepo.deleteEvent(id);
  }
}
