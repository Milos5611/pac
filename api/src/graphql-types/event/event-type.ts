import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Location} from "../location/location-type";
import {TalkDate} from "../talk-date/talk_date-type";

@objectType({description: 'Object representing events'})
@model({
  settings: {strict: true}
})
export class Event extends Entity {
  @field(type => ID)
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
  })
  id: string;

  @field()
  @property()
  name: string;

  @field({nullable: true})
  @property()
  start_date?: Date;

  @field({nullable: true})
  @property()
  end_date?: Date;

  @belongsTo(() => Location, {name: 'location'})
  location_id: string;

  @field()
  @property()
  event_location: string;

  @hasMany(() => TalkDate, {keyFrom: 'id', keyTo: 'talk_id'})
  talkDates: TalkDate[];
}
