import {Children} from "./children-type";
import {field, inputType} from "@loopback/graphql";

@inputType()
export class ChildrenInput implements Partial<Children> {
    @field()
    name: string;

    @field()
    topicId: string;
}
