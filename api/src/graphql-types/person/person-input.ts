import {Person} from './person-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank, RefId} from '../validators';

@inputType()
export class PersonInput implements Partial<Person> {
  @field()
  @NonBlank()
  name: string;

  @field()
  @RefId()
  organizationId: string;

  @field()
  @RefId()
  talkId: string;
}
