import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Organization} from "../organization/organization-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {
        "foreignKeys": {
            "organization_id": {
                "name": "organization_id",
                "foreignKey": "organization_id",
                "entityKey": "id",
                "entity": "Organization"
            }
        }
    }
})
export class Room extends Entity {
    @field(type => ID)
    @property({id: true})
    id: string;

    @field()
    @property()
    name: string;

    @field({nullable: true})
    @belongsTo(() => Organization)
    organization_id: string;
}
