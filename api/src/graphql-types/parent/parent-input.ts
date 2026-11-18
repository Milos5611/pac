import {Parent} from './parent-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank, RefId} from '../validators';

@inputType()
export class ParentInput implements Partial<Parent> {
  @field()
  @NonBlank(100)
  name: string;

  @field()
  @RefId()
  topicId: string;
}
