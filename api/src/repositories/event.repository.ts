import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {Event} from '../graphql-types/event/event-type';
import {ConferenceDatasource} from '../datasources';
import {
  bind,
  BindingScope,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';

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
  constructor(@inject('datasources.conference') dataSource: ConferenceDatasource) {
    super(Event, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }

  async getOne(id: string) {
    return this.findById(id);
  }

  async updateEvent(event: Event) {
    const foundEvent = await this.findById(event.id);
    if(!foundEvent) throw new Error("Event doesn't exist");
    await this.updateById(event.id, event);
    return this.findById(event.id);
  }
}
