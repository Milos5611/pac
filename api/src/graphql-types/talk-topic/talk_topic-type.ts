import {field, ID, objectType} from '../../../graphql';
import {Model, model, property} from '@loopback/repository';

@objectType({description: 'Object representing talk date'})
@model({settings: {strict: true}})
export class TalkTopic extends Model {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    talk_id: string;

    @field(type => ID)
    @property({
        type: 'string',
        id: true,
    })
    topic_id: string;
}
