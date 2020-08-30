import {field, ID, objectType} from '../../../graphql/server';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TopicChildren} from "../topic_children/topic_children-type";

@objectType({description: 'Object representing topic'})
@model({
    settings: {
        foreignKeys: {
            fk_topic_children_id: {
                name: 'fk_topic_children_id',
                entity: 'TopicChildren',
                entityKey: 'id',
                foreignKey: 'topic_children_id',
            },
        },
    }
})
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
    @belongsTo(() => TopicChildren, {keyFrom: "topicChildrenId"},{name: "topic_children_id"})
    topicChildrenId: string;
}
