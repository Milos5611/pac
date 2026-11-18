import {Topic} from './topic-type';
import {field, ID, inputType} from '@loopback/graphql';
import {IsOptional} from 'class-validator';
import {NonBlank, RefId} from '../validators';

@inputType()
export class TopicInput implements Partial<Topic> {
  @field(() => ID, {nullable: true})
  @IsOptional()
  @RefId()
  id?: string;

  @field()
  @NonBlank(100)
  name: string;

  @field()
  @RefId()
  talkId: string;
}
