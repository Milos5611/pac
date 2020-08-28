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
import {v4 as uuidv4} from 'uuid'

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class EventRepository
  extends DefaultCrudRepository<Event, typeof Event.prototype.id> implements LifeCycleObserver {
  /*topics: HasManyRepositoryFactory<Topic, typeof Topic.prototype.id>;
  talks: HasManyRepositoryFactory<Talk, typeof Talk.prototype.id>;*/

  @repository.getter('LocationRepository') getLocationRepository: Getter<LocationRepository>;
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      /*@repository.getter('TopicRepository') topicRepositoryGetter: Getter<TopicRepository>,
      @repository.getter('TalkRepository') talkRepositoryGetter: Getter<TalkRepository>*/) {
    super(Event, dataSource);
/*
    this.topics = this.createHasManyRepositoryFactoryFor('topics', topicRepositoryGetter);
    this.talks = this.createHasManyRepositoryFactoryFor('talks', talkRepositoryGetter);

    this.registerInclusionResolver('topics', this.topics.inclusionResolver);
    this.registerInclusionResolver('talks', this.talks.inclusionResolver);*/
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
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
