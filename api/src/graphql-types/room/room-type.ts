import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Organization} from "../organization/organization-type";
import {TalkDate} from "../talk-date/talk_date-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {strict: true}
})
export class Room extends Entity {
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

    @belongsTo(() => Organization, {name: 'organization'})
    organization_id: string;

    @hasMany(() => TalkDate, {keyFrom: 'id', keyTo: 'talk_id'})
    talkDate: TalkDate[]
}
