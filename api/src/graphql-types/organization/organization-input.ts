import {Organization} from './organization-type';
import {field, inputType} from "@loopback/graphql";

@inputType()
export class OrganizationInput implements Partial<Organization> {
    @field()
    name: string;
}
