import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Organization} from "../organization/organization-type";

@objectType({description: 'Object representing person'})
@model({
    settings: {
      strict: true
    }
})
export class Person extends Entity {
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
}
