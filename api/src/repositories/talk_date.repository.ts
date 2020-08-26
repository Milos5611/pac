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
import {TalkDate} from "../graphql-types/talk-date/talk_date-type";
import {TalkDateInput} from "../graphql-types/talk-date/talk_date-input";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class TalkDateRepository
    extends DefaultCrudRepository<TalkDate, typeof TalkDate.prototype.id>
    implements LifeCycleObserver {
    constructor(
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(TalkDate, dataSource);
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

    async createTalkDate(talkDate: TalkDateInput) {
        return this.create(talkDate);
    }
}
