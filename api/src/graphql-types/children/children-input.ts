import {field, ID, inputType} from '../../../module/graphql';
import {Children} from "./children-type";

@inputType()
export class ChildrenInput implements Partial<Children> {
    @field(() => ID)
    id: string;

    @field()
    name: string;
}
