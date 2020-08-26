import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {TalkTopic} from "../graphql-types/talk-topic/talk_topic-type";
import {TalkTopicRepository} from "../repositories";

@resolver(of => TalkTopic)
export class TalkTopicResolver {
    constructor(
        @repository('TalkTopicRepository') private readonly talkTopicRepo: TalkTopicRepository,
    ) {}

    @query(returns => TalkTopic, {nullable: true})
    async talksTopic(@arg('talkTopicId') talkTopicId: string) {
        return this.talkTopicRepo.getOne(talkTopicId);
    }

    @query(returns => [TalkTopic])
    async talksTopics(): Promise<TalkTopic[]> {
        return this.talkTopicRepo.getAll();
    }

    /*@mutation(returns => TalkDate)
    async createTalkDate(@arg('talkDate') talkDate: TalkDateInput): Promise<TalkDate> {
        return this.talkDateRepo.createTalkDate(talkDate);
    }*/
}
