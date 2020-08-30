import {arg, mutation, query, resolver} from '../../graphql/server';
import {repository} from '@loopback/repository';
import {Organization} from '../graphql-types/organization/organization-type';
import {OrganizationRepository} from '../repositories';
import {OrganizationInput} from "../graphql-types/organization/organization-input";

@resolver(of => Organization)
export class OrganizationResolver {
    constructor(
        @repository('OrganizationRepository')
        private readonly organizationRepo: OrganizationRepository,
    ) {}

    @query(returns => Organization, {nullable: true})
    async organization(@arg('organizationId') organizationId: string) {
        return this.organizationRepo.getOne(organizationId);
    }

    @query(returns => [Organization])
    async organizations(): Promise<Organization[]> {
        return this.organizationRepo.getAll();
    }

    @mutation(returns => Organization)
    async createOrganization(@arg('organization') organization: OrganizationInput): Promise<Organization> {
        return this.organizationRepo.createOrganization(organization);
    }
}
