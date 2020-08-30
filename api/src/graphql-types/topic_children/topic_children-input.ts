import {field, ID, inputType} from '../../../graphql/server';
import {TopicChildren} from "./topic_children-type";

@inputType()
export class TopicChildrenInput implements Partial<TopicChildren> {
    @field(type => ID)
    id: string;

    @field()
    topicId: string;

    @field()
    childrenId: string;
}