import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Topic} from "../topic/topic-type";
import {Children} from "../children/children-type";

@objectType({description: 'Object representing middle table of children entry of topic'})
@model({
    settings: {
        postgresql: {
            table: 'topic_children',
        },
    }
})
export class TopicChildren extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    id: string;

    @field()
    @belongsTo(() => Topic)
    topic_id: string;

    @field(type => [Children])
    @hasMany(() => Children, {keyTo: "topic_children_id"})
    childrens?: Children[]
}
