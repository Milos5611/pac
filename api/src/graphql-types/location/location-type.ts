import {field, ID, objectType} from '../../../graphql/server';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from "../event/event-type";
import {Room} from "../room/room-type";

@objectType({description: 'Object representing locations'})
@model({settings: {
    postgresql: {
      table: 'location',
  },
}})
export class Location extends Entity {
  @field(() => ID)
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @field()
  @property()
  name: string;

  @field(() => [Event], {nullable: true})
  @hasMany(() => Event, {keyTo: 'location_id', keyFrom: "id"})
  events?: Event[];

  @field(() => [Room], {nullable: true})
  @hasMany(() => Room, {keyTo: 'location_id', keyFrom: "id"})
  rooms?: Room[];
}
