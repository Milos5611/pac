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
import {TalkTopic} from "../graphql-types/talk-topic/talk_topic-type";
import {TalkTopicInput} from "../graphql-types/talk-topic/talk_topic-input";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class TalkTopicRepository
    extends DefaultCrudRepository<TalkTopic, typeof TalkTopic.prototype.id>
    implements LifeCycleObserver {
    constructor(
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(TalkTopic, dataSource);
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

    async createTalkDate(talkTopic: TalkTopicInput) {
        return this.create(talkTopic);
    }
}
