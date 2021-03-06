import {Entity, hasMany, model, property} from '@loopback/repository';
import {Person} from "../person/person-type";
import {field, ID, objectType} from "@loopback/graphql";

@objectType({description: 'Object representing organization'})
@model({settings: {
    postgresql: {
        table: 'organization',
    },
}})
export class Organization extends Entity {
    @field(type => ID)
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
