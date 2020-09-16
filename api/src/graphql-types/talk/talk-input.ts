import {Talk} from './talk-type';
import {field, inputType} from "@loopback/graphql";

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

    @field()
    roomId: string;
}
