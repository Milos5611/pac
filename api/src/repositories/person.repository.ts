import {BelongsToAccessor, DefaultCrudRepository, Getter, repository, RepositoryBindings} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
    bind,
    BindingScope,
    ContextTags,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
} from '@loopback/core';
import {Person} from '../graphql-types/person/person-type';
import {PersonInput} from "../graphql-types/person/person-input";
import {Organization} from "../graphql-types/organization/organization-type";
import {OrganizationRepository} from "./organization.repository";
import {Talk} from "../graphql-types/talk/talk-type";
import {TalkRepository} from "./talk.repository";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class PersonRepository
    extends DefaultCrudRepository<Person, typeof Person.prototype.id>
    implements LifeCycleObserver {

    public readonly organization: BelongsToAccessor<Organization, typeof Person.prototype.id>;
    public readonly talk: BelongsToAccessor<Talk, typeof Person.prototype.id>;

    constructor(
        @repository.getter('OrganizationRepository') organizationRepository: Getter<OrganizationRepository>,
        @repository.getter('TalkRepository') talkRepository: Getter<TalkRepository>,
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Person, dataSource);
        this.organization = this.createBelongsToAccessorFor(
            "organization",
            organizationRepository
        );
        this.talk = this.createBelongsToAccessorFor(
            "talk",
            talkRepository
        );
        this.registerInclusionResolver("organization", this.organization.inclusionResolver);
        this.registerInclusionResolver("talk", this.talk.inclusionResolver);
    }

    @inject('person')
    private samplePerson: Person[];

    async start() {
        /*const person = await this.find();
        if(person.length === 0) {
            await this.createAll(this.samplePerson);
        }*/
    }

    stop() {}

    async getAll() {
        return  this.find({
            include: [{relation: 'organization'}, {relation: "talk"}]
        });
    }

    async getOne(id: string) {
        return this.findById(id, {
            include: [{relation: 'organization'}, {relation: "talk"}]
        });
    }

    async createPerson(person: PersonInput) {
        return this.create(person);
    }
}
