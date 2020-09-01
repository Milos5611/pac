import {field, ID, objectType} from '../../../module/graphql';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing topic children'})
@model({settings: {strict: true}})
export class Children extends Entity {
    @field(() => ID)
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
