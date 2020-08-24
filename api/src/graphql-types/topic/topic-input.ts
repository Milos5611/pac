import {field, inputType} from '../../../graphql';
import {Topic} from './topic-type';

@inputType()
export class TopicInput implements Partial<Topic> {
    @field()
    name: string;
}
