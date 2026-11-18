import {
  DefaultCrudRepository,
  Getter,
  HasManyRepositoryFactory,
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
import {Talk} from '../graphql-types/talk/talk-type';
import {TalkInput} from '../graphql-types/talk/talk-input';
import {Topic} from '../graphql-types/topic/topic-type';
import {TopicRepository} from './topic.repository';
import {Person} from '../graphql-types/person/person-type';
import {PersonRepository} from './person.repository';

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES,
  },
})
@lifeCycleObserver('repository')
export class TalkRepository
  extends DefaultCrudRepository<Talk, typeof Talk.prototype.id>
  implements LifeCycleObserver
{
  public readonly topics: HasManyRepositoryFactory<
    Topic,
    typeof Talk.prototype.id
  >;

  public readonly persons: HasManyRepositoryFactory<
    Person,
    typeof Talk.prototype.id
  >;

  constructor(
    @repository.getter('TopicRepository')
    topicRepository: Getter<TopicRepository>,
    @repository.getter('PersonRepository')
    personRepository: Getter<PersonRepository>,
    @inject('datasources.conference') dataSource: ConferenceDatasource,
  ) {
    super(Talk, dataSource);

    this.topics = this.createHasManyRepositoryFactoryFor(
      'topics',
      topicRepository,
    );

    this.registerInclusionResolver('topics', this.topics.inclusionResolver);

    this.persons = this.createHasManyRepositoryFactoryFor(
      'persons',
      personRepository,
    );
    this.registerInclusionResolver('persons', this.persons.inclusionResolver);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find({
      include: [{relation: 'topics'}],
    });
  }

  async getOne(id: string) {
    return this.findOne({where: {id}, include: [{relation: 'topics'}]});
  }

  async createTalk(talk: TalkInput) {
    return this.create(talk);
  }

  async updateTalk(id: string, talk: TalkInput) {
    await this.updateById(id, talk);
    return this.findById(id, {include: [{relation: 'topics'}]});
  }
}
