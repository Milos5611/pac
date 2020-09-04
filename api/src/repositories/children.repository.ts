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
import {Children} from "../graphql-types/children/children-type";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {Topic} from "../graphql-types/topic/topic-type";
import {TopicRepository} from "./topic.repository";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class ChildrenRepository
  extends DefaultCrudRepository<Children, typeof Children.prototype.id> implements LifeCycleObserver {

  public readonly topic: BelongsToAccessor<Topic, typeof Children.prototype.id>;

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
      @repository.getter('TopicRepository') topicRepository: Getter<TopicRepository>
  ) {
    super(Children, dataSource);

    this.topic = this.createBelongsToAccessorFor(
        "topic",
        topicRepository
    );
    this.registerInclusionResolver("topic", this.topic.inclusionResolver);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find({
      include: [{relation: "topic"}]
    });
  }


  async getOne(id: string) {
    return this.findById(id, {
        include: [{relation: "topic"}]
    });
  }


  async createChildren(childrenData: ChildrenInput) {
    return this.create(childrenData);
  }

  async updateChildren(id: string, childrenData: ChildrenInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("Event doesn't exist");
    await this.updateById(id, childrenData);
    return this.findById(id);
  }
}
