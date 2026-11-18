import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {PersonInput} from '../graphql-types/person/person-input';
import {Person} from '../graphql-types/person/person-type';
import {GraphQLContext} from '../helper';
import {PersonRepository} from '../repositories';

@resolver(of => Person)
export class PersonResolver {
  constructor(
    @repository('PersonRepository')
    private readonly repo: PersonRepository,
  ) {}

  @query(() => Person, {nullable: true})
  async person(@arg('personId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Person])
  async persons(): Promise<Person[]> {
    return this.repo.getAll();
  }

  @mutation(() => Person)
  async createPerson(
    @arg('person') input: PersonInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Person> {
    await requireUser(context);
    return this.repo.createPerson(input);
  }

  @mutation(() => Person)
  async updatePerson(
    @arg('id') id: string,
    @arg('person') input: PersonInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Person> {
    await requireUser(context);
    return this.repo.updatePerson(id, input);
  }
}
