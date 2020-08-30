import {field, ID, objectType} from '../../../graphql/server';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Topic} from "../topic/topic-type";
import {Children} from "../children/children-type";

@objectType({description: 'Object representing middle table of children entry of topic'})
@model({
    settings: {
        postgresql: {
            table: 'topic_children',
        },
        foreignKeys: {
            fk_topic_id: {
                name: 'fk_topic_id',
                entity: 'Topic',
                entityKey: 'id',
                foreignKey: 'topic_id',
            },
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
    @belongsTo(() => Topic, {keyFrom: "topicId"},{name: "topic_id"})
    topicId: string;

    @field(type => [Children])
    @hasMany(() => Children, {keyTo: 'topic_children_id', keyFrom: "id"})
    childrens?: Children[]
}
