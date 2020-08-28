import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
  bind,
  BindingScope,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import {plainToClass} from "class-transformer";
import {v4 as uuidv4} from 'uuid'
import {TopicChildren} from "../graphql-types/topic_children/topic_children-type";
import {TopicChildrenInput} from "../graphql-types/topic_children/topic_children-input";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class TopicChildrenRepository
  extends DefaultCrudRepository<TopicChildren, typeof TopicChildren.prototype.id> implements LifeCycleObserver {

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource
  ) {
    super(TopicChildren, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createTopicChildren(topicChildren: TopicChildrenInput) {
    const newEvent = Object.assign(topicChildren, {id: uuidv4()});
    /*const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(eventData.locationId);*/

    const event = plainToClass(TopicChildren, newEvent);

    return this.create(event);
  }

  async updateTopicChildren(id: string, topicChildren: TopicChildrenInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("It doesn't exist");
    await this.updateById(id, found);
    return this.findById(id);
  }
}
