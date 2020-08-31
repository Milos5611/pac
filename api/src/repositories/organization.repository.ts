import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
    bind,
    BindingScope,
    ContextTags,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
} from '@loopback/core';
import {Organization} from '../graphql-types/organization/organization-type';
import {OrganizationInput} from "../graphql-types/organization/organization-input";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class OrganizationRepository
    extends DefaultCrudRepository<Organization, typeof Organization.prototype.id>
    implements LifeCycleObserver {
    constructor(
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Organization, dataSource);
    }

    @inject('organization')
    private sampleOrganization: Organization[];

    async start() {
       /* const organizations = await this.find();
        if(organizations.length === 0) {
            await this.createAll(this.sampleOrganization);
        }*/
    }

    stop() {}

    async getAll() {
        return this.find();
    }

    async getOne(id: string) {
        return this.findById(id);
    }

    async createOrganization(organization: OrganizationInput) {
        return this.create(organization);
    }
}
