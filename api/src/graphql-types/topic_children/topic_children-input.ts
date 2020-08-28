import {field, ID, inputType} from '../../../graphql';
import {TopicChildren} from "./topic_children-type";

@inputType()
export class TopicChildrenInput implements Partial<TopicChildren> {
    @field(type => ID)
    id: string;

    @field()
    topic_id: string;
}
