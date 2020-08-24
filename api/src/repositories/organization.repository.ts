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

    async start() {
        /*await this.createAll(this.sampleLocation);*/
    }

    stop() {}

    async getAll() {
        return this.find();
    }

    async getOne(id: string) {
        return this.findById(id);
    }

    async add(organization: OrganizationInput) {
        return this.create(organization);
    }
}
