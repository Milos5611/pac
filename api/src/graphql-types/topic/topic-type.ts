import {field, ID, objectType} from '../../../graphql/server';
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Talk} from "../talk/talk-type";
import {Children} from "../children/children-type";
import {TopicChildren} from "../topic_children/topic_children-type";
import {Parent} from "../parent/parent-type";
import {TopicParent} from "../topic_parent/topic_parent-type";

@objectType({description: 'Object representing topic'})
@model({
    settings: {
        foreignKeys: {
            fk_talk_id: {
                name: 'fk_talk_id',
                entity: 'Talk',
                entityKey: 'id',
                foreignKey: 'talk_id',
            },
        },
    }
})
export class Topic extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    id?: string;

    @field()
    @property()
    name: string;

    @field()
    @belongsTo(() => Talk, {keyFrom: "talkId"},{name: "talk_id"})
    talkId?: string;

    @field(type => [Children], {nullable: true})
    @hasMany(() => Children, {
        through: {
            model: () => TopicChildren,
        }
    })
    children?: Children[];

    @field(type => [Parent], {nullable: true})
    @hasMany(() => Parent, {
        through: {
            model: () => TopicParent,
        }
    })
    parent?: Parent[];
}
