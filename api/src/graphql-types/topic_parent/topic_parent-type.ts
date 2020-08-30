import {field, ID, objectType} from '../../../graphql/server';;
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Topic} from "../topic/topic-type";
import {Parent} from "../parent/parent-type";

@objectType({description: 'Object representing middle table of parent entry of topic'})
@model({
    settings: {
        postgresql: {
            table: 'topic_parent',
        },
    }
})
export class TopicParent extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    id: string;

    @field()
    @belongsTo(() => Topic, {name: "topic"})
    topic_id: string;

    @field(type => [Parent])
    @hasMany(() => Parent, {keyTo: "topic_parent_id"})
    parents?: Parent[]
}
