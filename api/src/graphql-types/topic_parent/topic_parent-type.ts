import {field, ID, objectType} from '../../../module/graphql';;
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Topic} from "../topic/topic-type";
import {Parent} from "../parent/parent-type";
import {Children} from "../children/children-type";

@objectType({description: 'Object representing middle table of parent entry of topic'})
@model({
    settings: {
        postgresql: {
            table: 'topic_parent',
        },
        foreignKeys: {
            fk_topic_id: {
                name: 'fk_topic_id',
                entity: 'Topic',
                entityKey: 'id',
                foreignKey: 'topic_id',
            },
            fk_paren_id: {
                name: 'fk_paren_id',
                entity: 'Parent',
                entityKey: 'id',
                foreignKey: 'parent_id',
            },
        },
    }
})
export class TopicParent extends Entity {
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
    @belongsTo(() => Children, {keyFrom: "parentId"},{name: "parent_id"})
    parentId?: string;
}
