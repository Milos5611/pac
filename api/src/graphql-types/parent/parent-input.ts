import {Parent} from "./parent-type";
import {field, inputType} from "@loopback/graphql";

@inputType()
export class ParentInput implements Partial<Parent> {
    @field()
    name: string;

    @field()
    topicId: string;
}
