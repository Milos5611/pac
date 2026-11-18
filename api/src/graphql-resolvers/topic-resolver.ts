import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {ChildrenInput} from '../graphql-types/children/children-input';
import {Children} from '../graphql-types/children/children-type';
import {ParentInput} from '../graphql-types/parent/parent-input';
import {Parent} from '../graphql-types/parent/parent-type';
import {requireUser} from '../auth/require-user';
import {TopicInput} from '../graphql-types/topic/topic-input';
import {Topic} from '../graphql-types/topic/topic-type';
import {GraphQLContext} from '../helper';
import {TopicRepository} from '../repositories';

@resolver(of => Topic)
export class TopicResolver {
  constructor(
    @repository('TopicRepository')
    private readonly repo: TopicRepository,
  ) {}

  @query(() => Topic, {nullable: true})
  async topic(@arg('topicId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Topic])
  async topics(): Promise<Topic[]> {
    return this.repo.getAll();
  }

  @mutation(() => Topic)
  async createTopic(
    @arg('topic') input: TopicInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Topic> {
    await requireUser(context);
    return this.repo.createTopic(input);
  }

  @mutation(() => Children)
  async addChildTopic(
    @arg('topicId') topicId: string,
    @arg('childTopic') childTopic: ChildrenInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Children> {
    await requireUser(context);
    return this.repo.addChildTopic(topicId, childTopic);
  }

  @mutation(() => Parent)
  async addParentTopic(
    @arg('topicId') topicId: string,
    @arg('parentTopic') parentTopic: ParentInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Parent> {
    await requireUser(context);
    return this.repo.addParentTopic(topicId, parentTopic);
  }

  @mutation(() => Boolean)
  async deleteTopic(
    @arg('id') id: string,
    @Ctx() context: GraphQLContext,
  ): Promise<boolean> {
    await requireUser(context);
    await this.repo.deleteTopic(id);
    return true;
  }
}
