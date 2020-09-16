import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Talk} from "../talk/talk-type";
import {Children} from "../children/children-type";
import {Parent} from "../parent/parent-type";
import {field, ID, objectType} from "@loopback/graphql";

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
    @field(() => ID)
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

    @field(() => [Children], {nullable: true})
    @hasMany(() => Children, {keyTo: 'topic_id', keyFrom: "id"})
    childrens?: Children[];

    @field(() => [Parent], {nullable: true})
    @hasMany(() => Parent, {keyTo: 'topic_id', keyFrom: "id"})
    parents?: Parent[];
}
