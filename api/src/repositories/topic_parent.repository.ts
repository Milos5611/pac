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
import {TopicParent} from "../graphql-types/topic_parent/topic_parent-type";
import {TopicParentInput} from "../graphql-types/topic_parent/topic_parent-input";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class TopicParentRepository
  extends DefaultCrudRepository<TopicParent, typeof TopicParent.prototype.id> implements LifeCycleObserver {

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource
  ) {
    super(TopicParent, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createTopicParent(topicParent: TopicParentInput) {
    const newParent = Object.assign(topicParent, {id: uuidv4()});
    /*const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(eventData.locationId);*/

    const parent = plainToClass(TopicParent, newParent);

    return this.create(parent);
  }

  async updateTopicParent(id: string, topicParent: TopicParentInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("It doesn't exist");
    await this.updateById(id, found);
    return this.findById(id);
  }
}
