import {field, ID, inputType} from '../../../graphql/server';
import {TopicParent} from "./topic_parent-type";

@inputType()
export class TopicParentInput implements Partial<TopicParent> {
    @field()
    name: string;

    @field()
    parentId: string;
}
