import {field, inputType} from '../../../graphql';
import {Person} from './person-type';

@inputType()
export class PersonInput implements Partial<Person> {
    @field({description: 'Person ID'})
    id: string;

    @field()
    name: string;

    @field()
    organization_id?: string;

    async getId() {}

    async getIdObject() {}

    async toJSON() {}

    async toObject() {}
}
