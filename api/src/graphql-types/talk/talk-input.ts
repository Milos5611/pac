import {field, inputType} from '../../../graphql';
import {Talk} from './talk-type';

@inputType()
export class TalkInput implements Partial<Talk> {
    @field()
    duration: number;

    @field()
    level: string;

    @field()
    language: string;

    @field()
    title: string;
}
