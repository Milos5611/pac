import {repository} from '@loopback/repository';
import {Organization} from '../graphql-types/organization/organization-type';
import {OrganizationRepository} from '../repositories';
import {OrganizationInput} from "../graphql-types/organization/organization-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper";
import {parseToken} from "../helper/util";
import {arg, mutation, query, resolver} from "@loopback/graphql";

@resolver(of => Organization)
export class OrganizationResolver {
    constructor(
        @repository('OrganizationRepository')
        private readonly organizationRepo: OrganizationRepository,
    ) {}

    @query(() => Organization, {nullable: true})
    async organization(@arg('organizationId') organizationId: string) {
        return this.organizationRepo.getOne(organizationId);
    }

    @query(() => [Organization])
    async organizations(): Promise<Organization[]> {
        return this.organizationRepo.getAll();
    }

    @mutation(() => Organization)
    async createOrganization(
        @arg('organization') organization: OrganizationInput,
        @Ctx() context: ContextTypes
    ): Promise<Organization | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.organizationRepo.createOrganization(organization);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
