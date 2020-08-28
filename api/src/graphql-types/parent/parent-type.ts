import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TopicParent} from "../topic_parent/topic_parent-type";

@objectType({description: 'Object representing parent entity of thee topic'})
@model({settings: {strict: true}})
export class Parent extends Entity {
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
    @belongsTo(() => TopicParent, {name: "topicParent"})
    topic_parent_id: string;
}
