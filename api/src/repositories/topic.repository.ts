import {
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    repository,
    RepositoryBindings
} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
    bind,
    BindingScope,
    ContextTags,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
    Getter
} from '@loopback/core';
import {Topic} from "../graphql-types/topic/topic-type";
import {TopicInput} from "../graphql-types/topic/topic-input";
import {Children} from "../graphql-types/children/children-type";
import {ChildrenRepository} from "./children.repository";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {Parent} from "../graphql-types/parent/parent-type";
import {ParentRepository} from "./parent.repository";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class TopicRepository
    extends DefaultCrudRepository<Topic, typeof Topic.prototype.id>
    implements LifeCycleObserver {

    public readonly childrens: HasManyRepositoryFactory<
        Children,
        typeof Topic.prototype.id
    >;
    public readonly parents: HasManyRepositoryFactory<
        Parent,
        typeof Topic.prototype.id
    >;

    constructor(
        @repository.getter('ChildrenRepository')
            childrenRepository: Getter<ChildrenRepository>,
        @repository.getter('ParentRepository')
            parentRepository: Getter<ParentRepository>,
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Topic, dataSource);
        this.childrens = this.createHasManyRepositoryFactoryFor(
            'childrens',
            childrenRepository,
        );
        this.parents = this.createHasManyRepositoryFactoryFor(
            'parents',
            parentRepository,
        );

        this.registerInclusionResolver('childrens', this.childrens.inclusionResolver);
        this.registerInclusionResolver('parents', this.parents.inclusionResolver);
    }

    async start() {}

    stop() {}

    async getAll() {
        return this.find({
            include: [{relation: "childrens"}, {relation: "parents"}]
        });
    }

    async getOne(id: string) {
        return this.findById(id, {
            include: [{relation: "childrens"}, {relation: "parents"}]
        });
    }

    async createTopic(topic: TopicInput) {
        return this.create(topic);
    }

    async addChildTopic(id: string, children: ChildrenInput) {
        return this.childrens(id).create(children);
    }

    async addParentTopic(id: string, parent: ParentInput) {
        return this.parents(id).create(parent);
    }
}
