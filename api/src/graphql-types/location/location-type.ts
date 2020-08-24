import {field, ID, objectType} from '../../../graphql';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from "../event/event-type";

@objectType({description: 'Object representing events'})
@model({settings: {strict: true}})
export class Location extends Entity {
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

  @hasMany(() => Event, {keyFrom: 'id', keyTo: 'location_id'})
  events: Event[];
}
