import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {TalkInput} from '../graphql-types/talk/talk-input';
import {Talk} from '../graphql-types/talk/talk-type';
import {GraphQLContext} from '../helper';
import {TalkRepository} from '../repositories';

@resolver(of => Talk)
export class TalkResolver {
  constructor(
    @repository('TalkRepository')
    private readonly repo: TalkRepository,
  ) {}

  @query(() => Talk, {nullable: true})
  async talk(@arg('talkId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Talk])
  async talks(): Promise<Talk[]> {
    return this.repo.getAll();
  }

  @mutation(() => Talk)
  async createTalk(
    @arg('talk') input: TalkInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Talk> {
    await requireUser(context);
    return this.repo.createTalk(input);
  }
}
