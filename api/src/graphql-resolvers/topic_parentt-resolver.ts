import {arg, mutation, query, resolver} from '../../graphql/server';;
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

    @query(returns => TopicParent, {nullable: true})
    async topicParent(@arg('id') id: string) {
        return this.topicParentRepository.getOne(id);
    }

    @query(returns => [TopicParent])
    async topicParents(): Promise<TopicParent[]> {
        return this.topicParentRepository.getAll();
    }

    @mutation(returns => TopicParent)
    async createTopicParent(
        @arg('topicChildren') topicParent: TopicParentInput,
    ): Promise<TopicParent> {
        return this.topicParentRepository.createTopicParent(topicParent);
    }

    @mutation(returns => TopicParent)
    async updateTopicParent(@arg('id') id: string,  @arg('topicParent') topicParent: TopicParentInput): Promise<TopicParent> {
        return this.topicParentRepository.updateTopicParent(id, topicParent);
    }
}
