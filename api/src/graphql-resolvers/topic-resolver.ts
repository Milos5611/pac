import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {Topic} from "../graphql-types/topic/topic-type";
import {TopicInput} from "../graphql-types/topic/topic-input";
import {TopicRepository} from "../repositories";

@resolver(of => Topic)
export class RoomResolver {
    constructor(
        @repository('TopicRepository')
        private readonly topicRepo: TopicRepository,
    ) {}

    @query(returns => Topic, {nullable: true})
    async topic(@arg('topicId') topicId: string) {
        return this.topicRepo.getOne(topicId);
    }

    @query(returns => [Topic])
    async topics(): Promise<Topic[]> {
        return this.topicRepo.getAll();
    }

    @mutation(returns => Topic)
    async createTopic(@arg('topic') topic: TopicInput): Promise<Topic> {
        return this.topicRepo.createTalk(topic);
    }
}
