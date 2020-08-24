import {field, ID, objectType} from '../../../graphql';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing person'})
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
export class Person extends Entity {
    @field(type => ID)
    @property({id: true})
    id: string;

    @field()
    @property()
    name: string;

    @field({nullable: true})
    @property()
    organization_id: string;
}
