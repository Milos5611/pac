import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {TalkDateRepository} from "../repositories";
import {TalkDate} from "../graphql-types/talk-date/talk_date-type";
import {TalkDateInput} from "../graphql-types/talk-date/talk_date-input";

@resolver(of => TalkDate)
export class TalkDateResolver {
    constructor(
        @repository('TalkDateRepository') private readonly talkDateRepo: TalkDateRepository,
    ) {}

    @query(returns => TalkDate, {nullable: true})
    async talkDate(@arg('talkDateId') talkDateId: string) {
        return this.talkDateRepo.getOne(talkDateId);
    }

    @query(returns => [TalkDate])
    async talksDates(): Promise<TalkDate[]> {
        return this.talkDateRepo.getAll();
    }

    /*@mutation(returns => TalkDate)
    async createTalkDate(@arg('talkDate') talkDate: TalkDateInput): Promise<TalkDate> {
        return this.talkDateRepo.createTalkDate(talkDate);
    }*/
}
