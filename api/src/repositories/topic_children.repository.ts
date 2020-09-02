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
}
