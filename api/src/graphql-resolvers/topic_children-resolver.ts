// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {arg, mutation, query, resolver} from '../../module/graphql';;
import {repository} from '@loopback/repository';
import {TopicChildren} from "../graphql-types/topic_children/topic_children-type";
import {TopicChildrenInput} from "../graphql-types/topic_children/topic_children-input";
import {TopicChildrenRepository} from "../repositories";

@resolver(() => TopicChildren)
export class TopicChildrenResolver {
    constructor(
        @repository('TopicChildrenRepository')
        private readonly topicChildrenRepository: TopicChildrenRepository
    ) {}

    @query(() => TopicChildren, {nullable: true})
    async topicChildren(@arg('id') id: string) {
        return this.topicChildrenRepository.getOne(id);
    }

    @query(() => [TopicChildren])
    async topicChildrens(): Promise<TopicChildren[]> {
        return this.topicChildrenRepository.getAll();
    }

    @mutation(() => TopicChildren)
    async createTopicChildren(
        @arg('topicChildren') topicChildren: TopicChildrenInput,
    ): Promise<TopicChildren> {
        return this.topicChildrenRepository.createTopicChildren(topicChildren);
    }

    @mutation(() => TopicChildren)
    async updateTopicChildren(@arg('id') id: string,  @arg('topicChildren') topicChildren: TopicChildrenInput): Promise<TopicChildren> {
        return this.topicChildrenRepository.updateTopicChildren(id, topicChildren);
    }
}
