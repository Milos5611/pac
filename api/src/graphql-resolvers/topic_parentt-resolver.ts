import {arg, query, resolver} from '../../module/graphql';;
import {repository} from '@loopback/repository';
import {TopicParent} from "../graphql-types/topic_parent/topic_parent-type";
import {TopicParentRepository} from "../repositories/topic_parent.repository";

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
}
