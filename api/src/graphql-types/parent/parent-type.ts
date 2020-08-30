import {field, ID, objectType} from '../../../graphql/server';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing parent entity of thee topic'})
@model({settings: {strict: true}})
export class Parent extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
    })
    id?: string;

    @field()
    @property()
    name: string;
}
