import {arg, mutation, query, resolver} from '../../module/graphql';
import {repository} from '@loopback/repository';
import {Talk} from "../graphql-types/talk/talk-type";
import {TalkInput} from "../graphql-types/talk/talk-input";
import {TalkRepository} from "../repositories";

@resolver(of => Talk)
export class TalkResolver {
    constructor(
        @repository('TalkRepository')
        private readonly talkRepo: TalkRepository,
    ) {}

    @query(() => Talk, {nullable: true})
    async talk(@arg('talkId') talkId: string) {
        return this.talkRepo.getOne(talkId);
    }

    @query(() => [Talk])
    async talks(): Promise<Talk[]> {
        return this.talkRepo.getAll();
    }

    @mutation(() => Talk)
    async createTalk(@arg('talk') talk: TalkInput): Promise<Talk> {
        return this.talkRepo.createTalk(talk);
    }
}
