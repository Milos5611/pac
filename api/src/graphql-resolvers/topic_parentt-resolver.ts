import {arg, mutation, query, resolver} from '../../module/graphql';;
import {repository} from '@loopback/repository';
import {TopicParent} from "../graphql-types/topic_parent/topic_parent-type";
import {TopicParentRepository} from "../repositories/topic_parent.repository";
import {TopicParentInput} from "../graphql-types/topic_parent/topic_parent-input";

@resolver(of => TopicParent)
export class TopicParentResolver {
    constructor(
        @repository('TopicParentRepository')
        private readonly topicParentRepository: TopicParentRepository
    ) {}

    @query(() => TopicParent, {nullable: true})
    async topicParent(@arg('id') id: string) {
        return this.topicParentRepository.getOne(id);
    }

    @query(() => [TopicParent])
    async topicParents(): Promise<TopicParent[]> {
        return this.topicParentRepository.getAll();
    }

    @mutation(() => TopicParent)
    async createTopicParent(
        @arg('topicChildren') topicParent: TopicParentInput,
    ): Promise<TopicParent> {
        return this.topicParentRepository.createTopicParent(topicParent);
    }

    @mutation(() => TopicParent)
    async updateTopicParent(@arg('id') id: string,  @arg('topicParent') topicParent: TopicParentInput): Promise<TopicParent> {
        return this.topicParentRepository.updateTopicParent(id, topicParent);
    }
}
