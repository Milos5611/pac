import {field, inputType} from '../../../graphql/server';
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
