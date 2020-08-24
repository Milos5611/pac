import {field, ID, objectType} from '../../../graphql';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing language'})
@model({settings: {strict: true}})
export class Language extends Entity {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  name: string;
}
