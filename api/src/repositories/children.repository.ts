import {DefaultCrudRepository, repository, RepositoryBindings} from '@loopback/repository';
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
import {Children} from "../graphql-types/children/children-type";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {v4 as uuidv4} from 'uuid'
import {TopicChildrenRepository} from "./topic_children.repository";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class ChildrenRepository
  extends DefaultCrudRepository<Children, typeof Children.prototype.id> implements LifeCycleObserver {

  @repository.getter('TopicChildrenRepository') geTopicChildrenRepository: Getter<TopicChildrenRepository>;
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
  ) {
    super(Children, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createChildren(childrenData: ChildrenInput) {
    /*const repo = await this.geTopicChildrenRepository();
    const topicChildren = await repo.createTopicChildren({
      id: uuidv4(),
      childrenId: childrenData.id,
      topicId: childrenData.
    });*/
    return this.create(childrenData);
  }

  async updateChildren(id: string, childrenData: ChildrenInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("Event doesn't exist");
    await this.updateById(id, childrenData);
    return this.findById(id);
  }
}
