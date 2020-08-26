import {field, objectType} from '../../../graphql';
import {model} from '@loopback/repository';
import {TalkDateInput} from "../talk-date/talk_date-input";

@objectType({description: 'Object representing talk date'})
@model({settings: {strict: true}})
export class TalkTopicInput implements Partial<TalkDateInput> {
    @field()
    talk_id: string;

    @field()
    topic_id: string;
}
