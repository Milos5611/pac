import {repository} from '@loopback/repository';
import {Room} from '../graphql-types/room/room-type';
import {RoomRepository} from '../repositories';
import {RoomInput} from "../graphql-types/room/room-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper";
import {parseToken} from "../helper/util";
import {arg, mutation, query, resolver} from "@loopback/graphql";

@resolver(of => Room)
export class RoomResolver {
    constructor(
        @repository('RoomRepository')
        private readonly roomRepo: RoomRepository,
    ) {}

    @query(() => Room, {nullable: true})
    async room(@arg('roomId') roomId: string) {
        return this.roomRepo.getOne(roomId);
    }

    @query(() => [Room])
    async rooms(): Promise<Room[]> {
        return this.roomRepo.getAll();
    }

    @mutation(() => Room)
    async createRoom(
        @arg('room') room: RoomInput,
        @Ctx() context: ContextTypes
    ): Promise<Room | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.roomRepo.createRoom(room);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
