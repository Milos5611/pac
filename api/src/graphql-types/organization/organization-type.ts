import {field, ID, objectType} from '../../../graphql';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Person} from "../person/person-type";
import {Room} from "../room/room-type";

@objectType({description: 'Object representing organization'})
@model({settings: {strict: true}})
export class Organization extends Entity {
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

    @hasMany(() => Person, {keyFrom: 'id', keyTo: 'organization_id'})
    persons: Person[];

    @hasMany(() => Room, {keyFrom: 'id', keyTo: 'organization_id'})
    rooms: Room[];
}
