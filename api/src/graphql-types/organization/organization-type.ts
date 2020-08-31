import {field, ID, objectType} from '../../../graphql/server';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Person} from "../person/person-type";

@objectType({description: 'Object representing organization'})
@model({settings: {
    postgresql: {
        table: 'organization',
    },
}})
export class Organization extends Entity {
    @field(() => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4'
    })
    id: string;

    @field()
    @property()
    name: string;

    @hasMany(() => Person, {keyTo: 'organization_id', keyFrom: "id"})
    persons: Person[];
}
