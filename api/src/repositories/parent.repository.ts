import {
  BelongsToAccessor,
  DefaultCrudRepository,
  Getter,
  repository,
  RepositoryBindings,
} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
  bind,
  BindingScope,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import {Parent} from '../graphql-types/parent/parent-type';
import {ParentInput} from '../graphql-types/parent/parent-input';
import {Topic} from '../graphql-types/topic/topic-type';
import {TopicRepository} from './topic.repository';

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES,
  },
})
@lifeCycleObserver('repository')
export class ParentRepository
  extends DefaultCrudRepository<Parent, typeof Parent.prototype.id>
  implements LifeCycleObserver
{
  public readonly topic: BelongsToAccessor<Topic, typeof Parent.prototype.id>;

  constructor(
    @inject('datasources.conference') dataSource: ConferenceDatasource,
    @repository.getter('TopicRepository')
    topicRepository: Getter<TopicRepository>,
  ) {
    super(Parent, dataSource);

    this.topic = this.createBelongsToAccessorFor('topic', topicRepository);
    this.registerInclusionResolver('topic', this.topic.inclusionResolver);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }

  async getOne(id: string) {
    return this.findOne({where: {id}});
  }

  async createParent(parentData: ParentInput) {
    return this.create(parentData);
  }

  async updateParent(id: string, parentData: ParentInput) {
    await this.updateById(id, parentData);
    return this.findById(id);
  }
}
