import {field, inputType} from '../../../graphql';
import {Organization} from './organization-type';

@inputType()
export class OrganizationInput implements Partial<Organization> {
    @field({description: 'Organization ID'})
    id: string;

    @field()
    name: string;

    async getId() {}

    async getIdObject() {}

    async toJSON() {}

    async toObject() {}
}
