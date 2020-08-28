import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Location} from "../location/location-type";
import {Talk} from "../talk/talk-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {strict: true}
})
export class Room extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true
    })
    id: string;

    @field()
    @property()
    name: string;

    @field()
    @belongsTo(() => Location, {name: "location"})
    location_id: string;

    @field(type => [Talk])
    @hasMany(() => Talk, {keyTo: "talk_id"})
    talks?: Talk[];
}
