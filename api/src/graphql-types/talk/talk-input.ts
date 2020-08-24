import {field, inputType} from '../../../graphql';
import {Talk} from './talk-type';

@inputType()
export class TalkInput implements Partial<Talk> {
    @field()
    duration: number;

    @field()
    language_id: string;

    @field()
    level: string;
}
