import {field, inputType} from '../../../module/graphql';
import {Organization} from './organization-type';

@inputType()
export class OrganizationInput implements Partial<Organization> {
    @field()
    name: string;
}
