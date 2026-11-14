import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {OrganizationInput} from '../graphql-types/organization/organization-input';
import {Organization} from '../graphql-types/organization/organization-type';
import {GraphQLContext} from '../helper';
import {OrganizationRepository} from '../repositories';

@resolver(of => Organization)
export class OrganizationResolver {
  constructor(
    @repository('OrganizationRepository')
    private readonly repo: OrganizationRepository,
  ) {}

  @query(() => Organization, {nullable: true})
  async organization(@arg('organizationId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Organization])
  async organizations(): Promise<Organization[]> {
    return this.repo.getAll();
  }

  @mutation(() => Organization)
  async createOrganization(
    @arg('organization') input: OrganizationInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Organization> {
    await requireUser(context);
    return this.repo.createOrganization(input);
  }
}
