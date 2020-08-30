import {field, ID, objectType} from '../../../graphql/server';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Talk} from "../talk/talk-type";

@objectType({description: 'Object representing topic'})
@model({settings: {strict: true}})
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
    @belongsTo(() => Talk, {name: "talk"})
    topic_id: string;
}
