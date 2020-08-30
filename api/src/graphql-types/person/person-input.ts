import {field, inputType} from '../../../graphql';
import {Person} from './person-type';

@inputType()
export class PersonInput implements Partial<Person> {
    @field()
    name: string;

    @field()
    organizationId: string;

    @field()
    talkId: string;
}
