import {field, inputType} from '../../../module/graphql';
import {Room} from './room-type';

@inputType()
export class RoomInput implements Partial<Room> {
    @field()
    name: string;

    @field()
    locationId: string;
}
