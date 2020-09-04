import {field, inputType} from '../../../module/graphql';;
import {Parent} from "./parent-type";

@inputType()
export class ParentInput implements Partial<Parent> {
    @field()
    name: string;

    @field()
    topicId: string;
}
