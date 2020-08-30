import {field, ID, inputType} from '../../../graphql/server';
import {Topic} from './topic-type';

@inputType()
export class TopicInput implements Partial<Topic> {
    @field(type => ID)
    id: string;

    @field()
    name: string;

    @field()
    topic_id: string;
}
