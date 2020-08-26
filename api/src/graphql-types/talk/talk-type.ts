import {field, ID, objectType} from '../../../graphql';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {TalkDate} from "../talk-date/talk_date-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {
       strict: true
    }
})
export class Talk extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
    })
    id: string;

    @field()
    @property()
    duration: number;

    @field()
    @property()
    level: string;

    @hasMany(() => TalkDate, {keyFrom: 'id', keyTo: 'talk_id'})
    talkDate: TalkDate[]
}
