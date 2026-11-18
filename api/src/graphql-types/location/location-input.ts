import {Location} from './location-type';
import {field, inputType} from '@loopback/graphql';
import {IsOptional} from 'class-validator';
import {NonBlank, RefId} from '../validators';

@inputType()
export class LocationInput implements Partial<Location> {
  @field({nullable: true})
  @IsOptional()
  @RefId()
  id?: string;

  @field()
  @NonBlank()
  name: string;
}
