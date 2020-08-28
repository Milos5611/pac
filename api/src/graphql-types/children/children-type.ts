import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TopicChildren} from "../topic_children/topic_children-type";

@objectType({description: 'Object representing topic'})
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

    @field()
    @belongsTo(() => TopicChildren)
    topic_children_id: string;
}
