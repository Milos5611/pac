import {arg, mutation, query, resolver} from '../../module/graphql';
import {repository} from '@loopback/repository';
import {Topic} from "../graphql-types/topic/topic-type";
import {TopicInput} from "../graphql-types/topic/topic-input";
import {TopicRepository} from "../repositories";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {Children} from "../graphql-types/children/children-type";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {Parent} from "../graphql-types/parent/parent-type";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper/types";
import {parseToken} from "../helper/util";

@resolver(of => Topic)
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
    async createTopic(
        @arg('topic') topic: TopicInput,
        @Ctx() context: ContextTypes
    ): Promise<Topic | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.topicRepo.createTopic(topic);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }

    @mutation(() => Children)
    async addChildTopic(
        @arg('topicId') topicId: string,
        @arg('childTopic') childTopic: ChildrenInput,
        @Ctx() context: ContextTypes
    ): Promise<Topic | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.topicRepo.addParentTopic(topicId, childTopic);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }

    @mutation(() => Parent)
    async addParentTopic(
        @arg('topicId') topicId: string,
        @arg('parentTopic') parentTopic: ParentInput,
        @Ctx() context: ContextTypes
    ): Promise<Topic | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.topicRepo.addParentTopic(topicId, parentTopic);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
