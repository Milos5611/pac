import {field, ID, objectType} from '../../../graphql/server';;
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TopicParent} from "../topic_parent/topic_parent-type";

@objectType({description: 'Object representing parent entity of thee topic'})
@model({
    settings: {
        foreignKeys: {
            fk_topic_parent_id: {
                name: 'fk_topic_parent_id',
                entity: 'TopicParent',
                entityKey: 'id',
                foreignKey: 'topic_parent_id',
            },
        },
    }
})
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
    @belongsTo(() => TopicParent, {keyFrom: "topicParentId"},{name: "topic_parent_id"})
    topicParentId: string;
}
