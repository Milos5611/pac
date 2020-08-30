import {field, ID, objectType} from '../../../graphql/server';
import {Entity, model, property} from '@loopback/repository';

@objectType({description: 'Object representing topic children'})
@model({settings: {strict: true}})
export class Children extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    id: string;

    @field()
    @property()
    topic_name: string;
}
