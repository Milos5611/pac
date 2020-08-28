import {field, ID, inputType} from '../../../graphql';
import {Children} from "./children-type";

@inputType()
export class ChildrenInput implements Partial<Children> {
    @field(type => ID)
    id: string;

    @field()
    topic_mame: string;

    @field()
    topic_children_id: string;
}
