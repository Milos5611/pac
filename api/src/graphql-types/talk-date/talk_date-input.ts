import {field, objectType} from '../../../graphql';
import {model} from '@loopback/repository';
import {TalkDate} from "./talk_date-type";

@objectType({description: 'Object representing talk date'})
@model({
    settings: { strict: true}
})
export class TalkDateInput implements Partial<TalkDate> {
    @field()
    id: string;

    @field({defaultValue: new Date()})
    start_date: Date;

    @field()
    level: string;

    @field()
    talk_id: string;

    @field()
    room_id: string;

    @field()
    event_id: string;

    @field()
    location_id: string;
}
