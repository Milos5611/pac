import {field, ID, inputType} from '../../../module/graphql';
import {Topic} from './topic-type';

@inputType()
export class TopicInput implements Partial<Topic> {
    @field(() => ID)
    id: string;

    @field()
    name: string;

    @field()
    talkId: string;
}
