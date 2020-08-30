import {field, ID, inputType} from '../../../graphql/server';;
import {Parent} from "./parent-type";

@inputType()
export class ParentInput implements Partial<Parent> {
    @field(type => ID)
    id: string;

    @field()
    topic_name: string;

    @field()
    topic_parent_id: string;
}
