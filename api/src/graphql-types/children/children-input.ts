import {Children} from './children-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank, RefId} from '../validators';

@inputType()
export class ChildrenInput implements Partial<Children> {
  @field()
  @NonBlank(100)
  name: string;

  @field()
  @RefId()
  topicId: string;
}
