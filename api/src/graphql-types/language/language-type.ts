import {field, ID, objectType} from '../../../graphql';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing language'})
@model({settings: {strict: true}})
export class Language extends Entity {
  @field(type => ID)
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @field()
  @property()
  name: string;
}
