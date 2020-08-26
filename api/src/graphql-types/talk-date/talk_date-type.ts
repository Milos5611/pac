import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Talk} from "../talk/talk-type";
import {Event} from "../event/event-type";
import {Room} from "../room/room-type";
import {Location} from "../location/location-type";

@objectType({description: 'Object representing talk date'})
@model({
    settings: { strict: true}
})
export class TalkDate extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    id: string;

    @field()
    @property()
    start_date: Date;

    @field()
    @property()
    level: string;

    @belongsTo(() => Talk, {name: 'talk'})
    talk_id: string;

    @belongsTo(() => Room, {name: 'room'})
    room_id: string;

    @belongsTo(() => Event, {name: 'event'})
    event_id: string;

    @belongsTo(() => Location, {name: 'location'})
    location_id: string;
}
