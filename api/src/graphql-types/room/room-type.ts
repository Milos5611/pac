import {field, ID, objectType} from '../../../module/graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Location} from "../location/location-type";
import {Talk} from "../talk/talk-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {
        foreignKeys: {
            fk_location_id: {
                name: 'fk_location_id',
                entity: 'Location',
                entityKey: 'id',
                foreignKey: 'location_id',
            },
        },
    }
})
export class Room extends Entity {
    @field(() => ID)
    @property({
        type: 'string',
        id: true
    })
    id: string;

    @field()
    @property()
    name: string;

    @field()
    @belongsTo(() => Location, {keyFrom: "locationId"},{name: "location_id"})
    locationId: string;

    @field(() => [Talk])
    @hasMany(() => Talk, {keyTo: 'location_id', keyFrom: "id"})
    talks?: Talk[];
}
