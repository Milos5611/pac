import {Talk} from './talk-type';
import {field, inputType} from '@loopback/graphql';
import {IsInt, Max, Min} from 'class-validator';
import {NonBlank, RefId} from '../validators';

@inputType()
export class TalkInput implements Partial<Talk> {
  @field()
  @IsInt()
  @Min(1)
  @Max(1440)
  duration: number;

  @field()
  @NonBlank(50)
  level: string;

  @field()
  @NonBlank(50)
  language: string;

  @field()
  @NonBlank()
  title: string;

  @field()
  @RefId()
  roomId: string;
}
