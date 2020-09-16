import {Room} from './room-type';
import {field, inputType} from "@loopback/graphql";

@inputType()
export class RoomInput implements Partial<Room> {
    @field()
    name: string;

    @field()
    locationId: string;
}
