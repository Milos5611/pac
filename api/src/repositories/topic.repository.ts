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
    constructor(
        @repository.getter('ChildrenRepository')
            childrenRepository: Getter<ChildrenRepository>,
        @repository.getter('TopicChildrenRepository')
            topicChildrenRepository: Getter<TopicChildrenRepository>,
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Topic, dataSource);
        this.childrens = this.createHasManyThroughRepositoryFactoryFor(
            'childrens',
            childrenRepository,
            topicChildrenRepository,
        );
    }

    async start() {
        /*await this.createAll(this.sampleLocation);*/
    }

    stop() {}

    async getAll() {
        const all = await this.find();
        console.log("all", all);
        return all;
    }

    async getOne(id: string) {
        return this.findById(id);
    }

    async createTalk(topic: TopicInput) {
        return this.create(topic);
    }
}
