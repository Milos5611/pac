import {field, ID, objectType} from '../../../module/graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Person} from "../person/person-type";
import {Topic} from "../topic/topic-type";
import {Room} from "../room/room-type";

@objectType({description: 'Object representing talk'})
@model({
    settings: {
        postgresql: {
            table: 'talk',
        },
        foreignKeys: {
            fk_room_id: {
                name: 'fk_room_id',
                entity: 'Room',
                entityKey: 'id',
                foreignKey: 'room_id',
            },
        },
    }
})
export class Talk extends Entity {
    @field(() => ID)
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
    title: string;

    @field()
    @property()
    level: string;

    @field()
    @property()
    language: string;

    @field(() => [Person])
    @hasMany(() => Person, {keyTo: 'talk_id', keyFrom: "id"})
    persons?: Person[];

    @field(() => [Topic])
    @hasMany(() => Topic, {keyTo: 'talk_id', keyFrom: "id"})
    topics?: Topic[];

    @field()
    @belongsTo(() => Room, {keyFrom: "roomId"},{name: "room_id"})
    roomId: string;
}
