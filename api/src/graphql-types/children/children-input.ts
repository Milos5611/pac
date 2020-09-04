import {field, inputType} from '../../../module/graphql';
import {Children} from "./children-type";

@inputType()
export class ChildrenInput implements Partial<Children> {
    @field()
    name: string;

    @field()
    topicId: string;
}
