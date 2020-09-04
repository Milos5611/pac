import {BelongsToAccessor, DefaultCrudRepository, Getter, repository, RepositoryBindings} from '@loopback/repository';
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
import {Parent} from "../graphql-types/parent/parent-type";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {Topic} from "../graphql-types/topic/topic-type";
import {Children} from "../graphql-types/children/children-type";
import {TopicRepository} from "./topic.repository";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class ParentRepository
  extends DefaultCrudRepository<Parent, typeof Parent.prototype.id> implements LifeCycleObserver {

  public readonly topic: BelongsToAccessor<Topic, typeof Children.prototype.id>;

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      @repository.getter('TopicRepository') topicRepository: Getter<TopicRepository>
  ) {
    super(Parent, dataSource);

    this.topic = this.createBelongsToAccessorFor(
        "topic",
        topicRepository
    );
    this.registerInclusionResolver("topic", this.topic.inclusionResolver);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createParent(parentData: ParentInput) {
    const newParent = Object.assign(parentData, {id: uuidv4()});
    const parent = plainToClass(Parent, newParent);

    return this.create(parent);
  }

  async updateParent(id: string, parentData: ParentInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("Event doesn't exist");
    await this.updateById(id, parentData);
    return this.findById(id);
  }
}
