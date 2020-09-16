import {Person} from './person-type';
import {field, inputType} from "@loopback/graphql";

@inputType()
export class PersonInput implements Partial<Person> {
    @field()
    name: string;

    @field()
    organizationId: string;

    @field()
    talkId: string;
}
