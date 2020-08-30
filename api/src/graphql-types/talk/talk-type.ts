import {field, ID, objectType} from '../../../graphql/server';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Person} from "../person/person-type";
import {Topic} from "../topic/topic-type";

@objectType({description: 'Object representing talk'})
@model({
    settings: {
       strict: true
    }
})
export class Talk extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
    })
    id: string;

    @field()
    @property()
    duration: number;

    @field()
    @property()
    title: string;

    @field()
    @property()
    level: string;

    @field()
    @property()
    language: string;

    @field(type => [Person])
    @hasMany(() => Person, {keyTo: "talk_id"})
    persons?: Person[];

    @field(type => [Topic])
    @hasMany(() => Topic, {keyTo: "topic_id"})
    topics?: Topic[];
}
