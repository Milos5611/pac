import {field, inputType} from '../../../graphql';
import {Person} from './person-type';

@inputType()
export class PersonInput implements Partial<Person> {
    @field()
    name: string;

    @field()
    organization_d: string;

    @field()
    talk_id: string;
}
