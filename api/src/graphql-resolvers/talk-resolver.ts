import {arg, mutation, query, resolver} from '../../module/graphql';
import {repository} from '@loopback/repository';
import {Talk} from "../graphql-types/talk/talk-type";
import {TalkInput} from "../graphql-types/talk/talk-input";
import {TalkRepository} from "../repositories";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper/types";
import {parseToken} from "../helper/util";

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
    async createTalk(
        @arg('talk') talk: TalkInput,
        @Ctx() context: ContextTypes
    ): Promise<Talk | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.talkRepo.createTalk(talk);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
