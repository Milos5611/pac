import {arg, mutation, query, resolver} from '../../graphql/server';
import {repository} from '@loopback/repository';
import {Topic} from "../graphql-types/topic/topic-type";
import {TopicInput} from "../graphql-types/topic/topic-input";
import {TopicRepository} from "../repositories";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {Children} from "../graphql-types/children/children-type";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {Parent} from "../graphql-types/parent/parent-type";

@resolver(() => Topic)
export class RoomResolver {
    constructor(
        @repository('TopicRepository')
        private readonly topicRepo: TopicRepository,
    ) {}

    @query(() => Topic, {nullable: true})
    async topic(@arg('topicId') topicId: string) {
        return this.topicRepo.getOne(topicId);
    }

    @query(() => [Topic])
    async topics() {
        return this.topicRepo.getAll();
    }

    @mutation(() => Topic)
    async createTopic(@arg('topic') topic: TopicInput): Promise<Topic> {
        return this.topicRepo.createTopic(topic);
    }

    @mutation(() => Children)
    async addChildTopic(
        @arg('topicId') topicId: string,
        @arg('childTopic') childTopic: ChildrenInput
    ): Promise<Topic> {
        return this.topicRepo.addChildTopic(topicId, childTopic);
    }

    @mutation(() => Parent)
    async addParentTopic(
        @arg('topicId') topicId: string,
        @arg('parentTopic') parentTopic: ParentInput
    ): Promise<Topic> {
        return this.topicRepo.addParentTopic(topicId, parentTopic);
    }
}
