import {field, ID, inputType} from '../../../graphql/server';;
import {Parent} from "./parent-type";

@inputType()
export class ParentInput implements Partial<Parent> {
    @field()
    name: string;
}
