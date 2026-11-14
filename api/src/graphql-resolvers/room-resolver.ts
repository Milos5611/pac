import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {RoomInput} from '../graphql-types/room/room-input';
import {Room} from '../graphql-types/room/room-type';
import {GraphQLContext} from '../helper';
import {RoomRepository} from '../repositories';

@resolver(of => Room)
export class RoomResolver {
  constructor(
    @repository('RoomRepository')
    private readonly repo: RoomRepository,
  ) {}

  @query(() => Room, {nullable: true})
  async room(@arg('roomId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Room])
  async rooms(): Promise<Room[]> {
    return this.repo.getAll();
  }

  @mutation(() => Room)
  async createRoom(
    @arg('room') input: RoomInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Room> {
    await requireUser(context);
    return this.repo.createRoom(input);
  }
}
