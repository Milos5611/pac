import {
    DefaultCrudRepository,
    HasManyThroughRepositoryFactory,
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
import {TopicChildren} from "../graphql-types/topic_children/topic_children-type";
import {ChildrenRepository} from "./children.repository";
import {TopicChildrenRepository} from "./topic_children.repository";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {Parent} from "../graphql-types/parent/parent-type";
import {TopicParent} from "../graphql-types/topic_parent/topic_parent-type";
import {ParentRepository} from "./parent.repository";
import {TopicParentRepository} from "./topic_parent.repository";

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

    public readonly childrens: HasManyThroughRepositoryFactory<
        Children,
        typeof Children.prototype.id,
        TopicChildren,
        typeof Topic.prototype.id
    >;
    public readonly parents: HasManyThroughRepositoryFactory<
        Parent,
        typeof Parent.prototype.id,
        TopicParent,
        typeof Topic.prototype.id
    >;

    constructor(
        @repository.getter('ChildrenRepository')
            childrenRepository: Getter<ChildrenRepository>,
        @repository.getter('TopicChildrenRepository')
            topicChildrenRepository: Getter<TopicChildrenRepository>,
        @repository.getter('ParentRepository')
            parentRepository: Getter<ParentRepository>,
        @repository.getter('TopicParentRepository')
            topicParentRepository: Getter<TopicParentRepository>,
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Topic, dataSource);
        this.childrens = this.createHasManyThroughRepositoryFactoryFor(
            'childrens',
            childrenRepository,
            topicChildrenRepository,
        );
        this.parents = this.createHasManyThroughRepositoryFactoryFor(
            'parents',
            parentRepository,
            topicParentRepository,
        );
    }

    async start() {}

    stop() {}

    async getAll() {
        return this.find();
    }

    async getOne(id: string) {
        return this.findById(id);
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
