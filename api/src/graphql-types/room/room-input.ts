import {field, inputType} from '../../../graphql/server';
import {Room} from './room-type';

@inputType()
export class RoomInput implements Partial<Room> {
    @field()
    name: string;

    @field()
    location_id: string;
}
