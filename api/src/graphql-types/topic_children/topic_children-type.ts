import {field, ID, objectType} from '../../../module/graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
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
            fk_children_id: {
                name: 'fk_children_id',
                entity: 'Children',
                entityKey: 'id',
                foreignKey: 'children_id',
            },
        },
    }
})
export class TopicChildren extends Entity {

    @field(() => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
    })
    id?: string;

    @field()
    @belongsTo(() => Topic, {keyFrom: "topicId"},{name: "topic_id"})
    topicId?: string;

    @field()
    @belongsTo(() => Children, {keyFrom: "childrenId"},{name: "children_id"})
    childrenId?: string;

}
