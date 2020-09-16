import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Topic} from "../topic/topic-type";
import {field, ID, objectType} from "@loopback/graphql";

@objectType({description: 'Object representing topic children'})
@model({
    settings: {
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
export class Children extends Entity {
    @field(() => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
    })
    id?: string;

    @field()
    @property()
    name: string;

    @field()
    @belongsTo(() => Topic, {keyFrom: "topicId"},{name: "topic_id"})
    topicId: string;

    @field(() => Topic, {nullable: true})
    topic?: Topic
}
