import {field, ID, objectType} from '../../../graphql';
import {Model, model, property} from '@loopback/repository';

@objectType({description: 'Object representing talk date'})
@model({
    settings: {
        "foreignKeys": {
            "fk_talk_id": {
                "name": "fk_talk_id",
                "foreignKey": "talk_id",
                "entityKey": "id",
                "entity": "talk_id"
            },
            "fk_room_id": {
                "name": "fk_room_id",
                "foreignKey": "room_id",
                "entityKey": "id",
                "entity": "room_id"
            },
            "fk_event_id": {
                "name": "fk_event_id",
                "foreignKey": "event_id",
                "entityKey": "id",
                "entity": "event_id"
            },
            "fk_location_id": {
                "name": "fk_location_id",
                "foreignKey": "location_id",
                "entityKey": "id",
                "entity": "location_id"
            }
        }
    }
})
export class TalkDate extends Model {
    @field(type => ID)
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id: string;

    @field()
    @property()
    start_date: Date;

    @field()
    @property()
    level: string;

    @field()
    @property()
    talk_id: string;

    @field()
    @property()
    room_id: string;

    @field()
    @property()
    event_id: string;

    @field()
    @property()
    location_id: string;
}
