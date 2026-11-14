import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {ParentInput} from '../graphql-types/parent/parent-input';
import {Parent} from '../graphql-types/parent/parent-type';
import {GraphQLContext} from '../helper';
import {ParentRepository} from '../repositories';

@resolver(of => Parent)
export class ParentResolver {
  constructor(
    @repository('ParentRepository')
    private readonly repo: ParentRepository,
  ) {}

  @query(() => Parent, {nullable: true})
  async parent(@arg('id') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Parent])
  async parents(): Promise<Parent[]> {
    return this.repo.getAll();
  }

  @mutation(() => Parent)
  async createParent(
    @arg('parent') input: ParentInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Parent> {
    await requireUser(context);
    return this.repo.createParent(input);
  }

  @mutation(() => Parent)
  async updateParent(
    @arg('id') id: string,
    @arg('parent') input: ParentInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Parent> {
    await requireUser(context);
    return this.repo.updateParent(id, input);
  }
}
