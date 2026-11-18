import {Organization} from './organization-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank} from '../validators';

@inputType()
export class OrganizationInput implements Partial<Organization> {
  @field()
  @NonBlank()
  name: string;
}
