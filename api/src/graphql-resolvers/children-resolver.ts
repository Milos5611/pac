import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {ChildrenInput} from '../graphql-types/children/children-input';
import {Children} from '../graphql-types/children/children-type';
import {GraphQLContext} from '../helper';
import {ChildrenRepository} from '../repositories';

@resolver(of => Children)
export class ChildrenResolver {
  constructor(
    @repository('ChildrenRepository')
    private readonly repo: ChildrenRepository,
  ) {}

  @query(() => Children, {nullable: true})
  async children(@arg('id') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Children])
  async childrens(): Promise<Children[]> {
    return this.repo.getAll();
  }

  @mutation(() => Children)
  async createChildren(
    @arg('children') input: ChildrenInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Children> {
    await requireUser(context);
    return this.repo.createChildren(input);
  }

  @mutation(() => Children)
  async updateChildren(
    @arg('id') id: string,
    @arg('children') input: ChildrenInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Children> {
    await requireUser(context);
    return this.repo.updateChildren(id, input);
  }
}
