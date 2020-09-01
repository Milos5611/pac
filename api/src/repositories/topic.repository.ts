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

    public readonly children: HasManyThroughRepositoryFactory<
        Children,
        typeof Children.prototype.id,
        TopicChildren,
        typeof Topic.prototype.id
        >;
    public readonly parent: HasManyThroughRepositoryFactory<
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
        this.children = this.createHasManyThroughRepositoryFactoryFor(
            'children',
            childrenRepository,
            topicChildrenRepository,
        );
        this.parent = this.createHasManyThroughRepositoryFactoryFor(
            'parent',
            parentRepository,
            topicParentRepository,
        );
    }

    async start() {
        /*await this.createAll(this.sampleLocation);*/
    }

    stop() {}

    async getAll() {
        const exectute = `select *
        from topic
        inner join topic_children tc on topic.id = tc.topic_id
        inner join children c on tc.children_id = c.id
        );`
        const all = await this.find();
        console.log("all", all);
        return all;
    }

    async getOne(id: string) {
        return this.findById(id);
    }

    async createTopic(topic: TopicInput) {
        return this.create(topic);
    }

    async addChildTopic(id: string, children: ChildrenInput) {
        return this.children(id).create(children);
    }

    async addParentTopic(id: string, parent: ParentInput) {
        return this.parent(id).create(parent);
    }
}
