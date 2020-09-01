import {field, ID, inputType} from '../../../module/graphql';;
import {Parent} from "./parent-type";

@inputType()
export class ParentInput implements Partial<Parent> {
    @field()
    name: string;
}
