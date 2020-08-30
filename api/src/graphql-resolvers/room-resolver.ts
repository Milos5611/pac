import {arg, mutation, query, resolver} from '../../graphql/server';
import {repository} from '@loopback/repository';
import {Room} from '../graphql-types/room/room-type';
import {RoomRepository} from '../repositories';
import {RoomInput} from "../graphql-types/room/room-input";

@resolver(of => Room)
export class RoomResolver {
    constructor(
        @repository('RoomRepository')
        private readonly roomRepo: RoomRepository,
    ) {}

    @query(returns => Room, {nullable: true})
    async room(@arg('roomId') roomId: string) {
        return this.roomRepo.getOne(roomId);
    }

    @query(returns => [Room])
    async rooms(): Promise<Room[]> {
        return this.roomRepo.getAll();
    }

    @mutation(returns => Room)
    async createRoom(@arg('room') room: RoomInput): Promise<Room | void> {
        return this.roomRepo.createRoom(room);
    }
}
