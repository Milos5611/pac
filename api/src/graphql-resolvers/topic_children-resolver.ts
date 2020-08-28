// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {TopicChildren} from "../graphql-types/topic_children/topic_children-type";
import {TopicChildrenInput} from "../graphql-types/topic_children/topic_children-input";
import {TopicChildrenRepository} from "../repositories";

@resolver(of => TopicChildren)
export class TopicChildrenResolver {
    constructor(
        @repository('TopicChildrenRepository')
        private readonly topicChildrenRepository: TopicChildrenRepository
    ) {}

    @query(returns => TopicChildren, {nullable: true})
    async topicChildren(@arg('id') id: string) {
        return this.topicChildrenRepository.getOne(id);
    }

    @query(returns => [TopicChildren])
    async topicChildrens(): Promise<TopicChildren[]> {
        return this.topicChildrenRepository.getAll();
    }

    @mutation(returns => TopicChildren)
    async createTopicChildren(
        @arg('topicChildren') topicChildren: TopicChildrenInput,
    ): Promise<TopicChildren> {
        return this.topicChildrenRepository.createTopicChildren(topicChildren);
    }

    @mutation(returns => TopicChildren)
    async updateTopicChildren(@arg('id') id: string,  @arg('topicChildren') topicChildren: TopicChildrenInput): Promise<TopicChildren> {
        return this.topicChildrenRepository.updateTopicChildren(id, topicChildren);
    }
}
