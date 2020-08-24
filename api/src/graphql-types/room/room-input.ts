import {field, inputType} from '../../../graphql';
import {Room} from './room-type';

@inputType()
export class RoomInput implements Partial<Room> {
    @field()
    name: string;

    @field()
    organization_id: string;
}
