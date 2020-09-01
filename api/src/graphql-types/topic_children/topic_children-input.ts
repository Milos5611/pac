import {field, ID, inputType} from '../../../module/graphql';
import {TopicChildren} from "./topic_children-type";

@inputType()
export class TopicChildrenInput implements Partial<TopicChildren> {
    @field(() => ID)
    id: string;

    @field()
    topicId: string;

    @field()
    childrenId: string;
}
