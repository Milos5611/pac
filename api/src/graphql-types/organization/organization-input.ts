import {field, inputType} from '../../../graphql/server';
import {Organization} from './organization-type';

@inputType()
export class OrganizationInput implements Partial<Organization> {
    @field()
    name: string;
}
