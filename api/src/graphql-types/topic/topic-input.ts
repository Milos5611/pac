import {Topic} from './topic-type';
import {field, ID, inputType} from "@loopback/graphql";

@inputType()
export class TopicInput implements Partial<Topic> {
    @field(() => ID)
    id: string;

    @field()
    name: string;

    @field()
    talkId: string;
}
