import {field, ID, objectType} from '../../../graphql/server';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Talk} from "../talk/talk-type";

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
    id: string;

    @field()
    @property()
    name: string;

    @field()
    @belongsTo(() => Talk, {keyFrom: "talkId"},{name: "talk_id"})
    talkId: string;
}
