import {field, ID, inputType} from '../../../graphql/server';
import {Children} from "./children-type";

@inputType()
export class ChildrenInput implements Partial<Children> {
    @field(type => ID)
    id: string;

    @field()
    name: string;
}
